---
name: create-playlist
description: Use when creating a YouTube playlist from matched video IDs. Triggers on requests to create, build, publish, or finalize a YouTube playlist.
version: 1.0.0
allowed-tools: [Bash, Read, Write]
---

# Create Playlist

Create a YouTube playlist and add all matched videos using the `yt-playlist` CLI.

## Prerequisites

Video matches must exist at `~/.config/yt-playlist/research/[artist-slug]/video-matches.md`. If not, tell the user to run the YouTube search phase first.

## Workflow

### Step 1: Read Video Matches

Read `video-matches.md` and extract all video IDs and their confidence levels. Present a summary:
- Total videos to add
- Any low-confidence matches (give user a last chance to review)

### Step 2: Check Authentication

```bash
"${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" auth status
```

If not authenticated or tokens are expired:
1. Tell the user they need to authenticate
2. Guide them to run: `! "${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" auth login`
   (The `!` prefix runs it in the current session so the browser opens and the OAuth callback works)
3. Wait for confirmation before proceeding

### Step 3: Create the Playlist

```bash
"${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" create --title "Best of [Artist]: Music Videos" --description "Curated best-of music video playlist. [N] videos spanning [year range]. Created with yt-playlist-curator." --privacy unlisted
```

This returns JSON with the playlist ID and URL. Save the playlist ID for the next step.

**Privacy note:** Default to `unlisted` so the user can review before making it public. They can change privacy in YouTube later.

### Step 4: Add Videos

Extract all video IDs as a comma-separated list and add them in order:

```bash
"${CLAUDE_PLUGIN_ROOT}/bin/yt-playlist" add-videos --playlist-id [PLAYLIST_ID] --video-ids [id1],[id2],[id3],...
```

This returns JSON showing which videos were added successfully and which failed.

### Step 5: Report Results

Present the final results:

```
✅ Playlist created successfully!

Title: Best of [Artist]: Music Videos
URL: https://www.youtube.com/playlist?list=[PLAYLIST_ID]
Privacy: Unlisted
Videos: [N added] / [N total]

[If any failed:]
⚠️ Failed to add:
- [Song Name] (videoId) — [error reason: deleted, region-locked, etc.]
```

Save results to `~/.config/yt-playlist/research/[artist-slug]/playlist-result.md`:

```markdown
# Playlist Result

- **Title:** Best of [Artist]: Music Videos
- **URL:** https://www.youtube.com/playlist?list=[PLAYLIST_ID]
- **Playlist ID:** [PLAYLIST_ID]
- **Privacy:** Unlisted
- **Created:** [date]
- **Videos added:** [N] / [N total]

## Added
1. [Song Name] — [videoId]
2. ...

## Failed (if any)
1. [Song Name] — [videoId] — [error]
```

## Non-API Fallback

If the user cannot or does not want to use the YouTube API (no Google Cloud project, quota exceeded, etc.), output a plain list they can use to manually create the playlist:

```
Manual playlist creation — copy these URLs:

1. [Song Name] — https://youtube.com/watch?v=[id]
2. [Song Name] — https://youtube.com/watch?v=[id]
...

To create the playlist manually:
1. Go to youtube.com and sign in
2. Open the first video
3. Click "Save" → "Create new playlist"
4. Name it "Best of [Artist]: Music Videos"
5. Open each subsequent video and click "Save" → add to your playlist
```
