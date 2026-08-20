import requests
import json
import csv
import os
from datetime import datetime, timedelta

BASE_URL = "https://webapi.radioedit.iheart.com/graphql"
SHA256_HASH = "386763c17145056713327cddec890cd9d4fea7558efc56d09b7cd4167eef6060"
STATION_SLUG = "webn-fm"
OUTPUT_FILE = "webn_recently_played.csv"
DAYS_BACK = 30

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}

# Load existing played_at timestamps to know where to stop
existing_timestamps = set()
latest_ts = 0
if os.path.exists(OUTPUT_FILE):
    with open(OUTPUT_FILE, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            played_at = row.get("played_at", "")
            if played_at:
                existing_timestamps.add(played_at)
                try:
                    ts = int(datetime.strptime(played_at, "%Y-%m-%d %H:%M:%S").timestamp())
                    if ts > latest_ts:
                        latest_ts = ts
                except ValueError:
                    pass

if latest_ts:
    print(f"Existing data found. Most recent entry: {datetime.fromtimestamp(latest_ts).strftime('%Y-%m-%d %H:%M:%S')}")
    cutoff_ts = latest_ts
else:
    cutoff = datetime.now() - timedelta(days=DAYS_BACK)
    cutoff_ts = int(cutoff.timestamp())
    print(f"No existing data. Scraping last {DAYS_BACK} days...")

def fetch_page(cursor=None):
    paging = {"take": 50}
    if cursor:
        paging["nextCursor"] = cursor

    params = {
        "operationName": "GetCurrentlyPlayingSongs",
        "variables": json.dumps({"slug": STATION_SLUG, "paging": paging}, separators=(",", ":")),
        "extensions": json.dumps({"persistedQuery": {"version": 1, "sha256Hash": SHA256_HASH}}, separators=(",", ":"))
    }

    resp = requests.get(BASE_URL, params=params, headers=headers)
    resp.raise_for_status()
    data = resp.json()
    amp = data["data"]["sites"]["find"]["stream"]["amp"]["currentlyPlaying"]
    return amp["tracks"], amp["pageInfo"]["nextCursor"]

new_tracks = []
cursor = None
page = 1

print(f"Scraping WEBN recently played songs (stopping at already-logged entries)...")

while True:
    tracks, next_cursor = fetch_page(cursor)

    done = False
    for track in tracks:
        start_ts = track.get("startTime", 0)
        if not start_ts:
            continue
        played_at = datetime.fromtimestamp(start_ts).strftime("%Y-%m-%d %H:%M:%S")
        # Stop when we reach a timestamp we've already logged
        if start_ts <= cutoff_ts or played_at in existing_timestamps:
            done = True
            break
        new_tracks.append(track)

    print(f"  Page {page}: {len(new_tracks)} new songs so far...")

    if done or not next_cursor:
        break

    cursor = next_cursor
    page += 1

print(f"\nDone. {len(new_tracks)} new songs found.")

if new_tracks:
    file_exists = os.path.exists(OUTPUT_FILE) and os.path.getsize(OUTPUT_FILE) > 0
    with open(OUTPUT_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["title", "artist", "album", "played_at", "duration_sec", "explicit"])
        for t in new_tracks:
            played_at = datetime.fromtimestamp(t["startTime"]).strftime("%Y-%m-%d %H:%M:%S") if t.get("startTime") else ""
            writer.writerow([
                t.get("title", ""),
                (t.get("artist") or {}).get("artistName", ""),
                t.get("albumName", ""),
                played_at,
                t.get("trackDuration", ""),
                t.get("explicitLyrics", ""),
            ])
    print(f"Appended {len(new_tracks)} new songs to {OUTPUT_FILE}")
else:
    print("No new songs to add.")
