"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlaylistCommand = void 0;
const commander_1 = require("commander");
const youtube_client_js_1 = require("../lib/youtube-client.js");
exports.createPlaylistCommand = new commander_1.Command("create")
    .description("Create a new YouTube playlist")
    .requiredOption("--title <title>", "Playlist title")
    .option("--description <desc>", "Playlist description", "")
    .option("--privacy <level>", "Privacy: public, unlisted, or private", "unlisted")
    .action(async (options) => {
    try {
        const privacy = options.privacy;
        if (!["public", "unlisted", "private"].includes(privacy)) {
            console.error(JSON.stringify({ error: `Invalid privacy level: ${privacy}. Use public, unlisted, or private.` }));
            process.exit(1);
        }
        const result = await (0, youtube_client_js_1.createPlaylist)({
            title: options.title,
            description: options.description,
            privacy,
        });
        console.log(JSON.stringify(result, null, 2));
    }
    catch (err) {
        console.error(JSON.stringify({ error: err.message }));
        process.exit(1);
    }
});
//# sourceMappingURL=create-playlist.js.map