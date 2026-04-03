---
name: youtube-search
description: Use when finding the correct official YouTube music video for each song on a curated tracklist. Triggers on requests to find YouTube videos, match songs to videos, or search YouTube for a tracklist.
version: 1.0.0
allowed-tools: [Bash, Read, Write, WebSearch, WebFetch]
---

# YouTube Search

For each song on the curated tracklist, find the best YouTube video — preferring official music videos from verified channels.

## Prerequisites

A tracklist must exist at `~/code/ts-yt-playlist/research/[artist-slug]/tracklist.md`. If not, tell the user to run the curation phase first.

## Workflow

### Step 1: Read the Tracklist

Read `tracklist.md` and extract the list of songs with their expected video type (official MV, lyric video, etc.).

### Step 2: Search for Each Song

For each song, use the `yt-playlist` CLI:

```bash
yt-playlist search "[artist] [song title] official music video" --max 5
```

This returns JSON with: videoId, title, channelTitle, viewCount, duration, publishedAt.

**If the CLI is not available** (no API key / not installed), fall back to:
```
WebSearch: site:youtube.com "[artist] [song title] official music video"
```
Then extract the video ID from the YouTube URL (the `v=` parameter).

### Step 3: Verify Each Match

Apply these heuristics to pick the best result:

**Channel verification:**
- Prefer channels containing "VEVO", the artist's name, or the record label name
- Reject "[Artist] - Topic" channels — these are auto-generated audio-only uploads, NOT music videos
- Reject fan channels, reaction channels, or cover artists

**Title verification — REJECT these outright (never acceptable):**
- "Lyric Video", "Lyrics", "Lyric" → lyric video, REJECT
- "Visualizer", "Visualiser" → visualizer, REJECT
- "Official Audio", "Audio Only", "Audio" → audio-only, REJECT
- "live", "concert", "Live at", "Live from" → live performance, REJECT
- "cover", "reaction", "remix", "acoustic", "karaoke" → not the original MV, REJECT
- "Vertical Video", "Shorts" → short-form/social content, REJECT
- "Behind the Scenes", "Making of" → BTS content, REJECT

**Title verification — ACCEPT these:**
- "Official Music Video" or "Official Video" — strong positive signal
- "Official HD Video", "Official 4K Video" — remastered MV, acceptable
- "(Music Video)" or "[Music Video]" — common labeling, acceptable
- No special label but from official channel with high views — likely the MV

**Important:** Some labels upload lyric videos with "Official Video" in the title. If the video description or thumbnail suggests lyrics/text as the primary visual, it is NOT a fully produced MV. When in doubt, note it as medium confidence for user review.

**View count verification:**
- Among official uploads, prefer the one with the highest view count (usually the canonical upload)
- Very low view counts (<10,000) on "official" videos may indicate re-uploads or fakes

**Duration verification:**
- Typical music video: 2-8 minutes
- Under 1 minute is likely a clip or teaser
- Over 10 minutes may be an extended/live version

**Confidence scoring:**
- **High:** Official channel + "Official Music Video" in title + high views + duration 2-8 min
- **Medium:** Official channel but title doesn't explicitly say "Music Video", or description is ambiguous — could be a lyric video mislabeled as "Official Video"
- **Low:** Uncertain channel, multiple plausible matches, or only non-MV results found
- **No match:** Only lyric videos, visualizers, or audio found — report this to the user as "no fully produced MV available" and DROP the song from the playlist

### Step 4: Write Results

Save to `~/code/ts-yt-playlist/research/[artist-slug]/video-matches.md`:

```markdown
# Video Matches for Best of [Artist]

## Matched Videos

### 1. [Song Name] — *[Album]* (Year)
- **Video:** [video title]
- **URL:** https://youtube.com/watch?v=[videoId]
- **Channel:** [channel name]
- **Views:** [count]
- **Duration:** [duration]
- **Confidence:** High / Medium / Low
- **Type confirmed:** Fully produced MV / Uncertain (needs review)
- **Notes:** [e.g., "Official MV, directed by Spike Jonze", or "flagged — title says 'Official Video' but may be lyric video"]

### 2. ...

## Summary
- Total matched: N / N
- High confidence: N
- Medium confidence: N
- Low confidence: N
- Needs review: [list any problematic matches]
```

### Step 5: Flag Issues

Present any problems to the user:
- Songs with only low-confidence matches
- Songs where no official video could be found
- Cases where multiple plausible official videos exist (e.g., original + remaster)
- Region-restricted or age-restricted videos (these may fail when adding to playlist)

Ask the user to confirm or provide alternatives for flagged items.

**If a song turns out to have NO fully produced MV on YouTube** (only lyric video, visualizer, or audio):
- Report it clearly: "[Song] — no fully produced music video found on YouTube. Only a [lyric video/visualizer/audio] exists."
- Remove it from the playlist and suggest a replacement from the same album (if one has a real MV)
- If no replacement exists, the album simply gets fewer picks

## Quota Awareness

The YouTube API has a daily quota of 10,000 units. Each search costs ~100 units (search.list) + ~1 unit per video detail lookup.

- A 25-song playlist needs ~25 searches = ~2,500 units
- Avoid re-searching songs that already have high-confidence matches in `video-matches.md`
- If the CLI reports a quota error, inform the user and suggest waiting until the quota resets (midnight Pacific Time) or using the WebSearch fallback
