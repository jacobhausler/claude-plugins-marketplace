---
name: curate-playlist
description: Use when applying subjective curation criteria to select songs for a playlist from researched data. Triggers on requests to curate, select, narrow down, or apply criteria to a playlist selection.
version: 1.0.0
allowed-tools: [Read, Write]
---

# Curate Playlist

Apply user-defined subjective criteria to research data to produce a final tracklist. This is where taste meets data.

## Core Principle

**Criteria are natural language, not scoring formulas.** Reason through each album conversationally, citing specific research data. The user is the final arbiter of taste — present your reasoning and let them approve, swap, or adjust.

## Prerequisites

Research must be complete. Read `~/code/ts-yt-playlist/research/[artist-slug]/synthesis.md` before starting. If it doesn't exist, tell the user to run the research phase first.

## Workflow

### Step 1: Confirm Criteria

Present the default criteria and ask the user to confirm or customize:

```
Curation Criteria:
- Videos per album: 1-3
- Video type: ONLY fully produced music videos (NO lyric videos, visualizers, official audio, or static image videos — ever)
- Weighting: balanced across critical acclaim, popularity, fan sentiment, and video quality
- Deep cuts: include at least 2-3 non-singles
- Era coverage: represent all major periods of the artist's career
- Target playlist length: 15-25 videos
- Order: chronological by album release
- Exclude: live versions, remixes, covers (unless user requests)
```

**Hard rule:** A song MUST have a fully produced music video to be eligible. No exceptions. If a song only has a lyric video, visualizer, or official audio — it cannot be on the playlist regardless of how good the song is. This is a music VIDEO playlist.

The user may also provide freeform criteria like:
- "Focus on their heavier songs"
- "Only include songs that would work for a road trip"
- "Weight the 90s era more heavily"
- "Include their biggest hits plus hidden gems"

Accept any criteria — use your knowledge of the music to reason about them.

### Step 2: Per-Album Selection (Show Your Work)

For each album (chronological order):

1. **List candidates** — ONLY songs that have fully produced music videos (🎬 in synthesis.md). Songs with only lyric videos, visualizers, or audio are NOT candidates.
2. **Evaluate each candidate** against the criteria, citing research data:
   - Critic scores and highlighted track mentions
   - Popularity ranking (streams, views)
   - Fan sentiment (beloved, divisive, overlooked)
   - Music video quality (director, awards, cultural impact)
3. **Make your picks** with clear reasoning. Example:

   > **OK Computer (1997)** — 3 picks (criteria allow up to 3, all have exceptional videos):
   > - "Paranoid Android" — Iconic animated MV directed by Magnus Carlsson, Pitchfork highlighted track, universally acclaimed, 180M views. *Must-include.*
   > - "Karma Police" — Jonathan Glazer-directed MV, top 3 most popular Radiohead song, won MTV VMA. *Strong pick on all criteria.*
   > - "No Surprises" — Grant Gee MV with the iconic fishbowl shot, critically praised, strong fan favorite. *Chosen over "Lucky" (no official MV) and "Let Down" (fan favorite but weaker video).*

4. **Note trade-offs** — if you're cutting a strong candidate, explain why. This gives the user the info they need to swap.

### Step 3: Present Full Draft

After going through all albums, present the complete tracklist:

```
Draft Tracklist: Best of [Artist] (N videos)

1. Song Name (Album, Year) — [reason]
2. Song Name (Album, Year) — [reason]
...

Criteria check:
- ✅ 1-3 videos per album
- ✅ All N videos are fully produced MVs (zero lyric videos/visualizers/audio)
- ✅ N deep cuts included
- ✅ All eras represented
- ✅ Total: N videos (target: 15-25)
```

### Step 4: User Review

Ask the user:
- "Want to swap any picks? I can suggest alternatives for any album."
- "Should I adjust the balance? (e.g., more deep cuts, fewer hits, weight a certain era)"
- "Any songs you definitely want included or excluded?"

Iterate until the user approves. For each swap, explain what changes and why.

### Step 5: Write Final Tracklist

Save to `~/code/ts-yt-playlist/research/[artist-slug]/tracklist.md`:

```markdown
# Best of [Artist]: Music Video Playlist

**Created:** [date]
**Criteria:** [summary of applied criteria]
**Total videos:** N

## Tracklist

1. **Song Name** — *Album* (Year)
   Type: Official MV | Director: [name]
   Reason: [one-line rationale]

2. ...
```

Tell the user the tracklist is saved and ready for the YouTube search phase.

## Handling Edge Cases

- **Album with no fully produced MVs:** Note it to the user and skip the album entirely. Do NOT fall back to lyric videos or audio. It's better to have a shorter playlist of real music videos than to pad it with non-MV content.
- **Artist with very few MVs:** Adjust expectations — the playlist may be shorter than 15. Tell the user how many fully produced MVs exist total and discuss whether to lower the target.
- **Debut vs. latest album:** Don't over-index on either. The criteria should guide era balance.
- **Collaborations/features:** Include only if the artist is the primary artist, unless user requests otherwise
- **Remasters/re-releases:** Treat as the same song. Pick the best video version.
