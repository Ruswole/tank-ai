import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface ProjectBody {
  name?: unknown;
}

interface ProjectRouteContext {
  params: Promise<{ projectId: string }>;
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

async function getOwnedProject(projectId: string, userId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return { response: errorResponse("Project not found", 404) };
  }

  if (project.ownerId !== userId) {
    return { response: errorResponse("Forbidden", 403) };
  }

  return { project };
}

export async function PATCH(request: Request, { params }: ProjectRouteContext) {
  const { userId } = await auth();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  const { projectId } = await params;
  const ownedProject = await getOwnedProject(projectId, userId);

  if (ownedProject.response) {
    return ownedProject.response;
  }

  const body = await getProjectBody(request);

  if (body === null || typeof body.name !== "string" || !body.name.trim()) {
    return errorResponse("Project name is required", 400);
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { name: body.name.trim() },
  });

  return Response.json({ project });
}

export async function DELETE(
  _request: Request,
  { params }: ProjectRouteContext,
) {
  const { userId } = await auth();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  const { projectId } = await params;
  const ownedProject = await getOwnedProject(projectId, userId);

  if (ownedProject.response) {
    return ownedProject.response;
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return Response.json({ projectId });
}
