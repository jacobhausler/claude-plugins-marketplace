---
description: Create a "best of" music video playlist for any artist — researches discography, curates picks, finds videos, and builds the YouTube playlist
argument-hint: <artist name> [criteria like "2 per album, weight deep cuts"]
allowed-tools: ["Bash", "Read", "Write", "WebSearch", "WebFetch", "Glob"]
---

# Best Of — Music Video Playlist Curator

Create a curated "best of" YouTube music video playlist for **$ARGUMENTS**.

## Orchestration

This command runs 4 phases in sequence, pausing for user confirmation between each. Do NOT skip phases or auto-proceed without user input.

### Phase 0: Setup & Resume Check

1. **Check setup status** by running:
   ```bash
   bash "${CLAUDE_PLUGIN_ROOT}/scripts/check-setup.sh"
   ```
   If any value is `false`, tell the user: "Some setup is needed first. Run `/yt-playlist-curator:setup` to get started." Then stop.

2. Parse the artist name (and any criteria) from the arguments
3. Convert artist name to a slug (lowercase, hyphens, no special chars)
4. Check if `~/.config/yt-playlist/research/[artist-slug]/` exists
   - If yes: read the existing files, show what's complete, and ask the user if they want to resume or start fresh
   - If no: create the directory and proceed

### Phase 1: Research

Use the **research-discography** skill to systematically research:
- Full discography (albums, EPs, singles)
- Critical reception (Pitchfork, AllMusic, NME, Rolling Stone scores)
- Popularity metrics (Spotify streams, YouTube views, chart positions)
- Music video inventory (which songs have official MVs, directors, awards)
- Fan/community favorites (Reddit, forums — deep cuts, beloved tracks)
- Existing "best of" lists (cross-reference published rankings)

All research is written to `~/.config/yt-playlist/research/[artist-slug]/`.

**After research completes:** Tell the user what you found — how many albums, how many songs have music videos, any surprising findings. Ask if they want to review the research before moving to curation.

### Phase 2: Curation

Use the **curate-playlist** skill to apply criteria and select songs.

If the user provided criteria in the arguments, use those. Otherwise, confirm defaults:
- 1-3 videos per album
- **ONLY fully produced music videos** — no lyric videos, visualizers, official audio, or static image videos. Ever.
- Balance critical acclaim, popularity, fan sentiment, and video production quality
- Include 2-3 deep cuts
- Target 15-25 videos total (may be fewer if the artist has limited MVs)
- Chronological order

**Show your reasoning for each album.** Present the full draft tracklist and wait for the user to approve, swap, or adjust before proceeding.

### Phase 3: YouTube Video Search

Use the **youtube-search** skill to find the correct YouTube video for each song.

- Use `"${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" search` CLI for API-powered search
- Verify matches against official channels, view counts, and durations
- Flag any ambiguous or low-confidence matches

**After search completes:** Show the matched videos with confidence levels. Ask the user to confirm before creating the playlist.

### Phase 4: Playlist Creation

Use the **create-playlist** skill to build the YouTube playlist.

- Check authentication status
- Create the playlist (unlisted by default)
- Add all videos in tracklist order
- Report the final playlist URL and any failures

## Important Notes

- Always pause between phases for user confirmation
- If any phase fails or has issues, address them before moving on
- The user can stop at any phase and resume later — all data is persisted to disk
- If the CLI is not set up, fall back to WebSearch for YouTube searches and output a manual URL list instead of creating the playlist via API
