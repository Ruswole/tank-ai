import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";
import { getProjectLists } from "@/lib/projects";
import {
  getAccessibleProject,
  getCurrentClerkIdentity,
} from "@/lib/project-access";

interface EditorRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default async function EditorRoomPage({ params }: EditorRoomPageProps) {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    redirect("/sign-in");
  }

  const { roomId } = await params;
  const project = await getAccessibleProject(roomId, identity);

  if (!project) {
    return <AccessDenied />;
  }

  const { ownedProjects, sharedProjects } = await getProjectLists();

  return (
    <WorkspaceShell
      project={{
        id: project.id,
        name: project.name,
        owner: project.ownerId === identity.userId ? "owned" : "shared",
        slug: project.name,
      }}
      projects={[...ownedProjects, ...sharedProjects]}
    />
  );
}
