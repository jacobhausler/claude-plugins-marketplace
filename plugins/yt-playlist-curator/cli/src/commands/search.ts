import { Command } from "commander";
import { searchVideos } from "../lib/youtube-client.js";

export const searchCommand = new Command("search")
  .description("Search YouTube for videos")
  .argument("<query>", "Search query")
  .option("--max <number>", "Maximum results to return", "5")
  .action(async (query: string, options: { max: string }) => {
    try {
      const results = await searchVideos({
        query,
        maxResults: parseInt(options.max, 10),
      });
      console.log(JSON.stringify(results, null, 2));
    } catch (err: any) {
      console.error(JSON.stringify({ error: err.message }));
      process.exit(1);
    }
  });
