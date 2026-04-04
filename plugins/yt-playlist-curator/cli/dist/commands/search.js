"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCommand = void 0;
const commander_1 = require("commander");
const youtube_client_js_1 = require("../lib/youtube-client.js");
exports.searchCommand = new commander_1.Command("search")
    .description("Search YouTube for videos")
    .argument("<query>", "Search query")
    .option("--max <number>", "Maximum results to return", "5")
    .action(async (query, options) => {
    try {
        const results = await (0, youtube_client_js_1.searchVideos)({
            query,
            maxResults: parseInt(options.max, 10),
        });
        console.log(JSON.stringify(results, null, 2));
    }
    catch (err) {
        console.error(JSON.stringify({ error: err.message }));
        process.exit(1);
    }
});
//# sourceMappingURL=search.js.map