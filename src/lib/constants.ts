export const AUTH_HEADER = "x-session-data";
export const AUTH_COOKIE = "next-elysia-edgedb-session";

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const WEBSITE_URL = process.env.WEBSITE_URL!;
export const OAUTH_CALLBACK_URL = `${WEBSITE_URL}/oauth/callback`;
