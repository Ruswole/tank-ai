import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export interface ProjectListItem {
  id: string;
  name: string;
  owner: "owned" | "shared";
  slug: string;
}

function toSidebarProject(project: {
  id: string;
  name: string;
  ownerId: string;
}): ProjectListItem {
  const slug =
    project.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "project";

  return {
    id: project.id,
    name: project.name,
    owner: "owned",
    slug,
  };
}

export async function getProjectLists() {
  const { userId } = await auth();

  if (!userId) {
    return {
      ownedProjects: [] as ProjectListItem[],
      sharedProjects: [] as ProjectListItem[],
    };
  }

  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const [ownedProjects, collaboratedProjects] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
    }),
    userEmail
      ? prisma.project.findMany({
          where: {
            collaborators: {
              some: { email: userEmail },
            },
          },
          orderBy: { updatedAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  const owned = ownedProjects.map(toSidebarProject);
  const shared = collaboratedProjects
    .filter((project) => project.ownerId !== userId)
    .map((project) => ({
      id: project.id,
      name: project.name,
      owner: "shared" as const,
      slug:
        project.name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60) || "project",
    }));

  return { ownedProjects: owned, sharedProjects: shared };
}
