import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface ProjectBody {
  name?: unknown;
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

async function getProjectBody(request: Request): Promise<ProjectBody | null> {
  try {
    const body: unknown = await request.json();

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return null;
    }

    return body as ProjectBody;
  } catch {
    return null;
  }
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json({ projects });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  const body = await getProjectBody(request);

  if (
    body === null ||
    (body.name !== undefined && typeof body.name !== "string")
  ) {
    return errorResponse("Project name must be a string", 400);
  }

  const name = body.name?.trim() || "Untitled Project";
  const project = await prisma.project.create({
    data: {
      ownerId: userId,
      name,
    },
  });

  return Response.json({ project }, { status: 201 });
}
