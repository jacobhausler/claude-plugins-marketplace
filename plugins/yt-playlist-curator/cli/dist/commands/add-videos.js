"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVideosCommand = void 0;
const commander_1 = require("commander");
const youtube_client_js_1 = require("../lib/youtube-client.js");
exports.addVideosCommand = new commander_1.Command("add-videos")
    .description("Add videos to an existing playlist")
    .requiredOption("--playlist-id <id>", "Playlist ID to add videos to")
    .requiredOption("--video-ids <ids>", "Comma-separated video IDs")
    .action(async (options) => {
    try {
        const videoIds = options.videoIds.split(",").map((id) => id.trim()).filter(Boolean);
        if (videoIds.length === 0) {
            console.error(JSON.stringify({ error: "No video IDs provided" }));
            process.exit(1);
        }
        const result = await (0, youtube_client_js_1.addVideosToPlaylist)(options.playlistId, videoIds);
        console.log(JSON.stringify(result, null, 2));
    }
    catch (err) {
        console.error(JSON.stringify({ error: err.message }));
        process.exit(1);
    }
});
//# sourceMappingURL=add-videos.js.map