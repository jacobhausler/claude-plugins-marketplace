export interface VideoResult {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
  viewCount?: string;
  likeCount?: string;
  duration?: string;
  thumbnailUrl: string;
}

export interface PlaylistInfo {
  playlistId: string;
  title: string;
  description: string;
  itemCount: number;
  privacy: string;
  url: string;
}

export interface SearchOptions {
  query: string;
  maxResults: number;
}

export interface CreatePlaylistOptions {
  title: string;
  description: string;
  privacy: "public" | "unlisted" | "private";
}

export interface OAuthTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}
