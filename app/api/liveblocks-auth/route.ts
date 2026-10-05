import { currentUser } from "@clerk/nextjs/server";

import {
  getAccessibleProject,
  getCurrentClerkIdentity,
} from "@/lib/project-access";
import { getCursorColor, getLiveblocksClient } from "@/lib/liveblocks";

interface LiveblocksAuthBody {
  room?: unknown;
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return errorResponse("Unauthorized", 401);
  }

  let body: LiveblocksAuthBody;
  try {
    const parsedBody: unknown = await request.json();

    if (
      typeof parsedBody !== "object" ||
      parsedBody === null ||
      Array.isArray(parsedBody)
    ) {
      return errorResponse("A room ID is required", 400);
    }

    body = parsedBody as LiveblocksAuthBody;
  } catch {
    return errorResponse("A room ID is required", 400);
  }

  if (typeof body.room !== "string" || !body.room.trim()) {
    return errorResponse("A room ID is required", 400);
  }

  const roomId = body.room.trim();
  const project = await getAccessibleProject(roomId, identity);

  if (!project) {
    return errorResponse("Forbidden", 403);
  }

  const user = await currentUser();
  const displayName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");
  const fallbackName =
    user?.username ?? identity.primaryEmail ?? identity.userId;

  const liveblocks = getLiveblocksClient();
  await liveblocks.getOrCreateRoom(roomId, { defaultAccesses: [] });

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: {
      name: displayName || fallbackName,
      avatar: user?.imageUrl ?? "",
      color: getCursorColor(identity.userId),
    },
  });

  session.allow(roomId, ["room:write"]);

  const { status, body: responseBody } = await session.authorize();
  return new Response(responseBody, {
    status,
    headers: { "Content-Type": "application/json" },
  });
}