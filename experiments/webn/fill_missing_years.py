import csv
import json
import re
import time
import urllib.request
import urllib.parse

INPUT_FILE = "webn_with_year.csv"
OUTPUT_FILE = "webn_with_year.csv"  # overwrite in place

MB_URL = "https://musicbrainz.org/ws/2/recording"
HEADERS = {
    "User-Agent": "WEBNScraper/1.0 (music-research-tool)"
}

def clean_title(title):
    title = re.sub(r'\(.*?(remaster|remastered|remix|live|acoustic|radio edit|single|version|edit|feat\.|ft\.|with )[^)]*\)', '', title, flags=re.IGNORECASE)
    title = re.sub(r'\[.*?(remaster|remastered|remix|live|acoustic|feat\.|ft\.)[^\]]*\]', '', title, flags=re.IGNORECASE)
    title = re.sub(r'\s*-\s*(remaster(ed)?|live|acoustic)\s*$', '', title, flags=re.IGNORECASE)
    return title.strip()

def musicbrainz_lookup(title, artist):
    query = f'recording:"{title}" AND artist:"{artist}"'
    params = urllib.parse.urlencode({"query": query, "fmt": "json", "limit": 5})
    url = f"{MB_URL}?{params}"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        recordings = data.get("recordings", [])
        years = []
        for rec in recordings:
            for release in rec.get("releases", []):
                date = release.get("date", "")
                if date and len(date) >= 4 and date[:4].isdigit():
                    years.append(int(date[:4]))
        return str(min(years)) if years else ""
    except Exception:
        return ""

def artist_matches(result_artist, our_artist):
    a = our_artist.lower()
    b = result_artist.lower()
    words = [w for w in re.split(r'\W+', a) if len(w) > 2]
    return any(w in b for w in words)

def musicbrainz_loose(title, artist):
    # Title only, verify artist loosely
    params = urllib.parse.urlencode({"query": f'recording:"{title}"', "fmt": "json", "limit": 10})
    url = f"{MB_URL}?{params}"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        recordings = data.get("recordings", [])
        for rec in recordings:
            credit = rec.get("artist-credit", [])
            for c in credit:
                result_artist = c.get("artist", {}).get("name", "")
                if artist_matches(result_artist, artist):
                    years = []
                    for release in rec.get("releases", []):
                        date = release.get("date", "")
                        if date and len(date) >= 4 and date[:4].isdigit():
                            years.append(int(date[:4]))
                    if years:
                        return str(min(years))
    except Exception:
        pass
    return ""

with open(INPUT_FILE, newline="", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

missing = [(i, r) for i, r in enumerate(rows) if not r["release_year"].strip()]
print(f"Looking up {len(missing)} missing songs via MusicBrainz...")

for count, (i, row) in enumerate(missing):
    title = row["title"]
    artist = row["artist"]
    cleaned = clean_title(title)

    year = musicbrainz_lookup(cleaned, artist)
    time.sleep(1.1)  # respect rate limit

    if not year:
        year = musicbrainz_loose(cleaned, artist)
        time.sleep(1.1)

    rows[i]["release_year"] = year

    if (count + 1) % 10 == 0 or count == 0:
        print(f"  {count + 1}/{len(missing)}: {artist} - {title} => {year or 'not found'}")

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

found = sum(1 for r in rows if r["release_year"].strip())
print(f"\nDone. {found}/{len(rows)} songs now have a release year ({found/len(rows)*100:.1f}%). Saved to {OUTPUT_FILE}")
