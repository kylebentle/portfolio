import csv
import json
from collections import defaultdict, Counter
import statistics

with open("webn_with_year.csv", newline="", encoding="utf-8") as f:
    rows = list(csv.DictReader(f))

# Filter rows with a year
def get_decade(year):
    if year >= 1970 and year <= 1979: return "1970s"
    if year >= 1980 and year <= 1989: return "1980s"
    if year >= 1990 and year <= 1999: return "1990s"
    if year >= 2000 and year <= 2009: return "2000s"
    if year >= 2010 and year <= 2019: return "2010s"
    if year >= 2020 and year <= 2029: return "2020s"
    return None

total_plays = len(rows)
unique_songs = len({(r["title"].lower(), r["artist"].lower()) for r in rows})
unique_artists = len({r["artist"].lower() for r in rows if r["artist"]})

# Release years
years_with_data = [(r, int(r["release_year"])) for r in rows if r["release_year"].strip().isdigit()]
release_years_all = [y for _, y in years_with_data]
median_year = int(statistics.median(release_years_all)) if release_years_all else "N/A"

# Decade plays
decade_plays = defaultdict(int)
decade_songs = defaultdict(set)
for r, y in years_with_data:
    d = get_decade(y)
    if d:
        decade_plays[d] += 1
        decade_songs[d].add((r["title"].lower(), r["artist"].lower()))

decades = ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"]
dec_plays_list = [decade_plays[d] for d in decades]
dec_unique_list = [len(decade_songs[d]) for d in decades]
dec_avg_list = [round(dec_plays_list[i] / dec_unique_list[i], 1) if dec_unique_list[i] else 0 for i in range(len(decades))]

total_decade_plays = sum(dec_plays_list)
dec_pct = {d: round(decade_plays[d] / total_decade_plays * 100) for d in decades}

# Year-level plays (1970–2026)
year_plays = defaultdict(int)
for _, y in years_with_data:
    if 1970 <= y <= 2026:
        year_plays[y] += 1
year_labels = list(range(1970, 2027))
year_plays_list = [year_plays[y] for y in year_labels]

# Artist plays
artist_plays = Counter()
for r in rows:
    if r["artist"]:
        artist_plays[r["artist"]] += 1
top_artists = artist_plays.most_common(15)

# Top songs (by (title, artist) combo)
song_plays = Counter()
song_year = {}
for r, y in years_with_data:
    key = (r["title"], r["artist"])
    song_plays[key] += 1
    song_year[key] = y
# Also count songs without year
for r in rows:
    if not r["release_year"].strip():
        key = (r["title"], r["artist"])
        song_plays[key] += 1

top_songs = song_plays.most_common(10)

print(f"=== STATS ===")
print(f"Total plays: {total_plays}")
print(f"Unique songs: {unique_songs}")
print(f"Unique artists: {unique_artists}")
print(f"Median release year: {median_year}")
print()
print(f"Decade plays: {dict(zip(decades, dec_plays_list))}")
print(f"Decade unique: {dict(zip(decades, dec_unique_list))}")
print(f"Decade avg: {dict(zip(decades, dec_avg_list))}")
print(f"Decade %: {dec_pct}")
print()
print(f"Year plays (1990-2026):")
for y in range(1990, 2027):
    print(f"  {y}: {year_plays[y]}")
print()
print(f"Top 15 artists:")
for name, plays in top_artists:
    print(f"  {plays:4d}  {name}")
print()
print(f"Top 10 songs:")
for (title, artist), plays in top_songs:
    yr = song_year.get((title, artist), "?")
    print(f"  {plays:4d}  {artist} - {title} [{yr}]")

# Export as JSON for easy use
output = {
    "total_plays": total_plays,
    "unique_songs": unique_songs,
    "unique_artists": unique_artists,
    "median_year": median_year,
    "decades": decades,
    "dec_plays": dec_plays_list,
    "dec_unique": dec_unique_list,
    "dec_avg": dec_avg_list,
    "dec_pct": dec_pct,
    "year_labels": year_labels,
    "year_plays": year_plays_list,
    "top_artists": [{"name": n, "plays": p} for n, p in top_artists],
    "top_songs": [{"title": t, "artist": a, "plays": p, "year": song_year.get((t, a), "")} for (t, a), p in top_songs],
}
with open("stats.json", "w") as f:
    json.dump(output, f, indent=2)
print("\nSaved to stats.json")
