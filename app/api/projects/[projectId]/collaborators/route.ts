import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

import { getCurrentClerkIdentity } from "@/lib/project-access";
import { prisma } from "@/lib/prisma";

interface CollaboratorRouteContext {
  params: Promise<{ projectId: string }>;
}

interface CollaboratorBody {
  email?: unknown;
}

interface ClerkUser {
  id?: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  emailAddresses: Array<{ emailAddress: string }>;
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
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

async function getAccessibleProject(
  projectId: string,
  userId: string,
  email: string | null,
) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        ...(email ? [{ collaborators: { some: { email } } }] : []),
      ],
    },
    include: { collaborators: { orderBy: { createdAt: "asc" } } },
  });
}

async function enrichCollaborators(
  collaborators: Array<{ id: string; email: string; createdAt: Date }>,
) {
  const emails = collaborators.map((collaborator) => collaborator.email);
  const userResponse = emails.length
    ? await (await clerkClient()).users.getUserList({ emailAddress: emails })
    : [];
  const users: ClerkUser[] = Array.isArray(userResponse)
    ? (userResponse as unknown as ClerkUser[])
    : (userResponse as { data: ClerkUser[] }).data;
  const usersByEmail = new Map(
    users.flatMap((user) =>
      user.emailAddresses.map(
        (address) => [address.emailAddress, user] as const,
      ),
    ),
  );

  return collaborators.map((collaborator) => {
    const user = usersByEmail.get(collaborator.email);
    const displayName = [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ");

    return {
      id: collaborator.id,
      email: collaborator.email,
      name: displayName || user?.username || null,
      imageUrl: user?.imageUrl ?? null,
      createdAt: collaborator.createdAt,
    };
  });
}

async function enrichUser(userId: string) {
  const user = (await (
    await clerkClient()
  ).users.getUser(userId)) as unknown as ClerkUser;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const primaryEmail = user.emailAddresses[0]?.emailAddress ?? null;

  return {
    email: primaryEmail,
    name: name || user.username || primaryEmail,
    imageUrl: user.imageUrl ?? null,
  };
}

export async function GET(
  _request: Request,
  { params }: CollaboratorRouteContext,
) {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return errorResponse("Unauthorized", 401);
  }

  const { projectId } = await params;
  const project = await getAccessibleProject(
    projectId,
    identity.userId,
    identity.primaryEmail?.toLowerCase() ?? null,
  );

  if (!project) {
    return errorResponse("Project not found", 404);
  }

  return Response.json({
    owner: await enrichUser(project.ownerId),
    collaborators: await enrichCollaborators(project.collaborators),
    canManage: project.ownerId === identity.userId,
  });
}

export async function POST(
  request: Request,
  { params }: CollaboratorRouteContext,
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

  let body: CollaboratorBody;
  try {
    body = (await request.json()) as CollaboratorBody;
  } catch {
    return errorResponse("A valid email is required", 400);
  }

  if (typeof body.email !== "string") {
    return errorResponse("A valid email is required", 400);
  }

  const email = body.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorResponse("A valid email is required", 400);
  }

  const collaborator = await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId, email } },
    create: { projectId, email },
    update: {},
  });

  return Response.json({ collaborator }, { status: 201 });
}

export async function DELETE(
  request: Request,
  { params }: CollaboratorRouteContext,
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

  let body: CollaboratorBody;
  try {
    body = (await request.json()) as CollaboratorBody;
  } catch {
    return errorResponse("A collaborator email is required", 400);
  }

  if (typeof body.email !== "string" || !body.email.trim()) {
    return errorResponse("A collaborator email is required", 400);
  }

  await prisma.projectCollaborator.deleteMany({
    where: { projectId, email: body.email.trim().toLowerCase() },
  });

  return Response.json({ email: body.email.trim().toLowerCase() });
}
