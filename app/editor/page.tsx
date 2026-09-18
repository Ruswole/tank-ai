import { EditorShell } from "@/components/editor/editor-shell";
import { getProjectLists } from "@/lib/projects";

export default async function EditorPage() {
  const { ownedProjects, sharedProjects } = await getProjectLists();

  return (
    <EditorShell
      initialProjects={{
        ownedProjects,
        sharedProjects,
      }}
    />
  );
}
