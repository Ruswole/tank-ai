import { Liveblocks } from "@liveblocks/node";

const cursorColors = [
  "#00c8d4",
  "#8b82ff",
  "#34d399",
  "#fbbf24",
  "#ff6166",
  "#f75f8f",
  "#52a8ff",
  "#bf7af0",
] as const;

const globalForLiveblocks = globalThis as typeof globalThis & {
  liveblocks?: Liveblocks;
};

export function getLiveblocksClient() {
  if (!globalForLiveblocks.liveblocks) {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY;

    if (!secret) {
      throw new Error("LIVEBLOCKS_SECRET_KEY is not configured");
    }

    globalForLiveblocks.liveblocks = new Liveblocks({ secret });
  }

  return globalForLiveblocks.liveblocks;
}

export function getCursorColor(userId: string) {
  let hash = 0;

  for (const character of userId) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return cursorColors[hash % cursorColors.length];
}