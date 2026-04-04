"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVideos = searchVideos;
exports.createPlaylist = createPlaylist;
exports.addVideosToPlaylist = addVideosToPlaylist;
exports.listPlaylists = listPlaylists;
const googleapis_1 = require("googleapis");
const oauth_js_1 = require("./oauth.js");
function getYouTubeClient(authenticated) {
    if (authenticated) {
        const auth = (0, oauth_js_1.getAuthenticatedClient)();
        return googleapis_1.google.youtube({ version: "v3", auth });
    }
    // For search-only operations, try authenticated client first (uses OAuth quota),
    // fall back to unauthenticated (requires API key in env)
    const tokens = (0, oauth_js_1.loadTokens)();
    if (tokens) {
        const auth = (0, oauth_js_1.createOAuth2Client)();
        auth.setCredentials(tokens);
        return googleapis_1.google.youtube({ version: "v3", auth });
    }
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        throw new Error("No authentication available.\n" +
            "Either run `yt-playlist auth login` or set YOUTUBE_API_KEY environment variable.");
    }
    return googleapis_1.google.youtube({ version: "v3", auth: apiKey });
}
async function searchVideos(options) {
    const youtube = getYouTubeClient(false);
    const searchResponse = await youtube.search.list({
        part: ["snippet"],
        q: options.query,
        type: ["video"],
        maxResults: options.maxResults,
        videoEmbeddable: "true",
    });
    const items = searchResponse.data.items || [];
    if (items.length === 0)
        return [];
    // Fetch video details for view counts and durations
    const videoIds = items.map((item) => item.id?.videoId).filter(Boolean);
    const detailsResponse = await youtube.videos.list({
        part: ["statistics", "contentDetails", "snippet"],
        id: videoIds,
    });
    const detailsMap = new Map((detailsResponse.data.items || []).map((item) => [item.id, item]));
    return items.map((item) => {
        const videoId = item.id?.videoId || "";
        const details = detailsMap.get(videoId);
        return {
            videoId,
            title: item.snippet?.title || "",
            channelTitle: item.snippet?.channelTitle || "",
            publishedAt: item.snippet?.publishedAt || "",
            description: item.snippet?.description || "",
            viewCount: details?.statistics?.viewCount ?? undefined,
            likeCount: details?.statistics?.likeCount ?? undefined,
            duration: details?.contentDetails?.duration ?? undefined,
            thumbnailUrl: item.snippet?.thumbnails?.high?.url ||
                item.snippet?.thumbnails?.default?.url ||
                "",
        };
    });
}
async function createPlaylist(options) {
    const youtube = getYouTubeClient(true);
    const response = await youtube.playlists.insert({
        part: ["snippet", "status"],
        requestBody: {
            snippet: {
                title: options.title,
                description: options.description,
            },
            status: {
                privacyStatus: options.privacy,
            },
        },
    });
    const playlist = response.data;
    const playlistId = playlist.id || "";
    return {
        playlistId,
        title: playlist.snippet?.title || "",
        description: playlist.snippet?.description || "",
        itemCount: 0,
        privacy: playlist.status?.privacyStatus || options.privacy,
        url: `https://www.youtube.com/playlist?list=${playlistId}`,
    };
}
async function addVideosToPlaylist(playlistId, videoIds) {
    const youtube = getYouTubeClient(true);
    const added = [];
    const failed = [];
    for (const videoId of videoIds) {
        try {
            await youtube.playlistItems.insert({
                part: ["snippet"],
                requestBody: {
                    snippet: {
                        playlistId,
                        resourceId: {
                            kind: "youtube#video",
                            videoId,
                        },
                    },
                },
            });
            added.push(videoId);
        }
        catch (err) {
            failed.push({
                videoId,
                error: err.message || String(err),
            });
        }
    }
    return { added, failed };
}
async function listPlaylists() {
    const youtube = getYouTubeClient(true);
    const response = await youtube.playlists.list({
        part: ["snippet", "contentDetails", "status"],
        mine: true,
        maxResults: 50,
    });
    return (response.data.items || []).map((item) => ({
        playlistId: item.id || "",
        title: item.snippet?.title || "",
        description: item.snippet?.description || "",
        itemCount: item.contentDetails?.itemCount || 0,
        privacy: item.status?.privacyStatus || "",
        url: `https://www.youtube.com/playlist?list=${item.id}`,
    }));
}
//# sourceMappingURL=youtube-client.js.map