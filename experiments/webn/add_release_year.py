import csv
import json
import re
import time
import urllib.request
import urllib.parse

INPUT_FILE = "webn_recently_played.csv"
OUTPUT_FILE = "webn_with_year.csv"

def clean_title(title):
    # Remove remaster/reissue tags, featured artists, live/acoustic versions, etc.
    title = re.sub(r'\(.*?(remaster|remastered|re-master|remix|live|acoustic|radio edit|single|version|edit|feat\.|ft\.|with )[^)]*\)', '', title, flags=re.IGNORECASE)
    title = re.sub(r'\[.*?(remaster|remastered|remix|live|acoustic|feat\.|ft\.)[^\]]*\]', '', title, flags=re.IGNORECASE)
    title = re.sub(r'\s*-\s*(remaster(ed)?|live|acoustic)\s*$', '', title, flags=re.IGNORECASE)
    return title.strip()

def artist_matches(result_artist, our_artist):
    a = our_artist.lower()
    b = result_artist.lower()
    # Check if any significant word from our artist appears in the result artist
    words = [w for w in re.split(r'\W+', a) if len(w) > 2]
    return any(w in b for w in words)

def itunes_search(term, limit=1):
    query = urllib.parse.urlencode({"term": term, "media": "music", "limit": limit})
    url = f"https://itunes.apple.com/search?{query}"
    try:
        with urllib.request.urlopen(url, timeout=5) as resp:
            data = json.loads(resp.read())
        return data.get("results", [])
    except Exception:
        return []

def get_year(results):
    if results:
        release_date = results[0].get("releaseDate", "")
        return release_date[:4] if release_date else ""
    return ""

def lookup_release_year(title, artist):
    # Attempt 1: artist + title
    results = itunes_search(f"{artist} {title}")
    year = get_year(results)
    if year:
        return year

    # Attempt 2: artist + cleaned title
    cleaned = clean_title(title)
    if cleaned != title:
        time.sleep(0.05)
        results = itunes_search(f"{artist} {cleaned}")
        year = get_year(results)
        if year:
            return year

    # Attempt 3: title-only search, verify artist loosely
    time.sleep(0.05)
    results = itunes_search(cleaned if cleaned != title else title, limit=5)
    for r in results:
        result_artist = r.get("artistName", "")
        if artist_matches(result_artist, artist):
            release_date = r.get("releaseDate", "")
            return release_date[:4] if release_date else ""

    return ""

import os

with open(INPUT_FILE, newline="", encoding="utf-8") as f:
    all_rows = list(csv.DictReader(f))

# Load already-processed entries from output file (keyed by played_at)
processed_keys = set()
if os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            processed_keys.add(row.get("played_at", ""))

new_rows = [r for r in all_rows if r.get("played_at", "") not in processed_keys]

print(f"{len(all_rows)} total songs, {len(processed_keys)} already processed, {len(new_rows)} new to look up...")

if not new_rows:
    print("Nothing new to process.")
else:
    file_exists = os.path.exists(OUTPUT_FILE) and os.path.getsize(OUTPUT_FILE) > 0
    with open(OUTPUT_FILE, "a", newline="", encoding="utf-8") as f:
        fieldnames = list(all_rows[0].keys()) + ["release_year"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()

        for i, row in enumerate(new_rows):
            year = lookup_release_year(row["title"], row["artist"])
            row["release_year"] = year

            if (i + 1) % 10 == 0 or i == 0:
                print(f"  {i + 1}/{len(new_rows)}: {row['artist']} - {row['title']} => {year or 'not found'}")

            writer.writerow(row)
            time.sleep(0.05)  # be polite to the API

    print(f"\nDone. Appended {len(new_rows)} new songs to {OUTPUT_FILE}")
