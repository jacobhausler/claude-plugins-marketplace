---
name: research-discography
description: Use when researching an artist's discography, music videos, critical reception, popularity, and fan sentiment for playlist curation. Triggers on requests to research an artist's catalog, best songs, or music video history.
version: 1.0.0
allowed-tools: [WebSearch, WebFetch, Read, Write, Bash, Glob]
---

# Research Discography

Systematically research an artist's full catalog to build a comprehensive picture of their music and music videos. All research is written to markdown files in `~/code/ts-yt-playlist/research/[artist-slug]/` so it persists across sessions.

## Resume Logic

Before starting, check if `~/code/ts-yt-playlist/research/[artist-slug]/` already exists:
- If it does, read the files present and tell the user which phases are already complete
- Offer to skip completed phases, redo specific ones, or start fresh
- Only redo phases the user asks for

## Artist Slug

Convert the artist name to a URL-safe slug: lowercase, replace spaces with hyphens, remove special characters. Example: "Rage Against the Machine" → `rage-against-the-machine`

## Research Workflow

Complete each step in order. After each step, write the results to the corresponding file before moving on.

### Step 1: Discography Inventory → `discography.md`

1. WebSearch for `"[artist] discography Wikipedia"`
2. WebFetch the Wikipedia discography page
3. Extract and organize:
   - **Studio albums** with release year
   - **EPs** with release year
   - **Notable singles** (especially those not on albums)
   - **Compilations** (note but deprioritize)
4. Write to `discography.md` as a structured list grouped by type

### Step 2: Critical Reception → `critical-reception.md`

For each studio album and major EP:
1. WebSearch for `"[artist] [album] review Pitchfork"` and `"[artist] [album] AllMusic review"`
2. Also search NME, Rolling Stone if available
3. Extract:
   - **Numeric scores** (Pitchfork /10, AllMusic /5 stars, etc.)
   - **Highlighted tracks** that critics specifically praised
   - **One-line consensus** of critical opinion
4. Write to `critical-reception.md` organized by album, with a summary table at the top

### Step 3: Popularity Metrics → `popularity.md`

1. WebSearch for `"[artist] most popular songs Spotify"` or `"[artist] top tracks"`
2. WebSearch for `"[artist] most viewed music videos YouTube"`
3. Extract:
   - **Top 10-20 most-streamed songs** with approximate play counts
   - **Top 10-20 most-viewed YouTube videos** with approximate view counts
   - **Chart history** — any #1 hits, top 10 hits, or notable chart performances
4. Write to `popularity.md` with ranked lists

### Step 4: Music Video Inventory → `music-videos.md`

This is the most critical step. We are building a playlist of ONLY fully produced music videos — no lyric videos, no visualizers, no official audio, no static image videos, no "vertical videos," no short-form clips.

1. WebSearch for `"[artist] music videos list"` and `"[artist] official music videos"`
2. WebSearch for `"[artist] best music videos"` and `"[artist] music video awards"`
3. WebSearch for `"[artist] music video directors"` to find production credits
4. For each song in the discography, classify into exactly one category:
   - **🎬 Fully produced MV** — directed, filmed, with narrative/visual concept, actors/sets/locations, production crew. This is the ONLY type eligible for the playlist.
   - **❌ Lyric video** — text/typography over backgrounds, motion graphics with lyrics. NOT eligible.
   - **❌ Visualizer** — abstract visuals, waveforms, album art animations. NOT eligible.
   - **❌ Official audio** — static image + audio. NOT eligible.
   - **❌ Performance-only video** — simple single-camera performance with no production concept (distinct from a produced performance video with sets/lighting/direction). NOT eligible unless explicitly produced.
   - **❌ No official video** — NOT eligible.
5. To confirm a video is a fully produced MV, look for evidence of:
   - A credited **director**
   - A **narrative, concept, or visual treatment** (even abstract/artistic ones count — the key is intentional filmmaking)
   - **Production elements**: locations, sets, costumes, choreography, actors, cinematography
   - Being labeled "Official Music Video" (not "Official Video" alone, which labels sometimes use for lyric videos)
4. Note any standout music video details:
   - **Director** (especially acclaimed directors: Spike Jonze, Michel Gondry, Hype Williams, David Fincher, etc.)
   - **Awards** (VMAs, Grammy for Best Music Video, etc.)
   - **Cultural impact** (iconic imagery, controversial, heavily referenced)
   - **Production quality** (budget, visual style, narrative)
5. Write to `music-videos.md` organized by album, with a legend for video types

### Step 5: Fan & Community Perspective → `fan-favorites.md`

1. WebSearch for `"[artist] best songs Reddit"`
2. WebSearch for `"[artist] underrated songs"` and `"[artist] deep cuts"`
3. WebSearch for `"[artist] favorite songs forum"`
4. Extract:
   - **Fan consensus favorites** — songs that appear repeatedly across discussions
   - **Beloved deep cuts** — non-singles that fans champion
   - **Divisive songs** — songs fans love but critics don't, or vice versa
   - **Live favorites** — songs known for being incredible live
5. Write to `fan-favorites.md` with clear categories

### Step 6: Existing "Best Of" Lists → `existing-lists.md`

1. WebSearch for `"best [artist] songs of all time"` and `"best [artist] songs ranked"`
2. Find 3-5 published lists from different sources (music publications, fan sites)
3. For each list, note the source and their top picks
4. Cross-reference to identify:
   - **Consensus picks** — songs appearing on most/all lists
   - **Outliers** — interesting picks unique to one list
   - **Notable omissions** — songs you'd expect but that are missing
5. Write to `existing-lists.md` with a cross-reference table

### Step 7: Synthesis → `synthesis.md`

Combine all research into a single reference document:

1. Create a **table for each album** with these columns:
   - Song name
   - Has fully produced MV? (🎬 Yes / ❌ No — and if no, note what exists: lyric video, visualizer, audio only, nothing)
   - Critic consensus (score + one-line take)
   - Popularity rank (approximate streaming/view ranking)
   - Fan sentiment (beloved / liked / divisive / overlooked)
   - Video notes (director, awards, cultural impact)

2. Add a **summary section** at the top:
   - Total songs with fully produced music videos (NOT counting lyric videos, visualizers, or audio-only)
   - Top 5 most critically acclaimed songs
   - Top 5 most popular songs
   - Top 5 fan favorites
   - Songs with award-winning or iconic music videos

3. Add a **recommendations section** noting any obvious must-includes and interesting edge cases

## Output

After completing all steps, tell the user:
- How many albums/EPs were cataloged
- How many songs have fully produced music videos (and how many only have lyric videos/visualizers/audio)
- Any surprising findings (e.g., "their most popular song doesn't have a music video")
- That the research is saved and ready for the curation phase
