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

The setup command installs dependencies, copies bundled Google Cloud credentials, and walks you through OAuth login. No manual Google Cloud project creation needed — just authenticate and go.
