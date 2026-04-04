# Claude Plugins Marketplace

Personal plugin marketplace for Claude Code.

## Plugins

- **yt-playlist-curator** — Curate "best of" YouTube music video playlists by researching an artist's discography, applying subjective curation criteria, finding official music videos, and creating YouTube playlists.

## Installation

```
/plugin marketplace add jacobhausler/claude-plugins-marketplace
/plugin install yt-playlist-curator@jacobhausler-claude-plugins-marketplace
/reload-plugins
/yt-playlist-curator:setup
```

The setup command walks you through everything: installing dependencies, creating a Google Cloud project, enabling the YouTube API, and authenticating.
