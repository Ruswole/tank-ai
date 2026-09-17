"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogContent } from "@/components/editor/project-dialogs";
import {
  ProjectSidebar,
  type ProjectSidebarItem,
} from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";
import { useProjectDialogs } from "@/components/editor/use-project-dialogs";

const initialProjects: ProjectSidebarItem[] = [
  { id: "project-1", name: "API Gateway", owner: "owned", slug: "api-gateway" },
  {
    id: "project-2",
    name: "Analytics Stack",
    owner: "owned",
    slug: "analytics-stack",
  },
  {
    id: "project-3",
    name: "Payments Platform",
    owner: "shared",
    slug: "payments-platform",
  },
  {
    id: "project-4",
    name: "Infrastructure Review",
    owner: "shared",
    slug: "infrastructure-review",
  },
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] =
    useState<ProjectSidebarItem[]>(initialProjects);
  const {
    dialogType,
    targetProject,
    draftName,
    setDraftName,
    isSubmitting,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submit,
  } = useProjectDialogs();

  const slugPreview = useMemo(() => slugify(draftName), [draftName]);

  const handleCreateProject = async () => {
    const trimmedName = draftName.trim();
    const slug = slugify(trimmedName);

    if (!trimmedName || !slug) {
      return;
    }

    setProjects((currentProjects) => [
      {
        id: `project-${Date.now()}`,
        name: trimmedName,
        owner: "owned",
        slug,
      },
      ...currentProjects,
    ]);
  };

  const handleRenameProject = async () => {
    if (!targetProject) {
      return;
    }

    const trimmedName = draftName.trim();
    const slug = slugify(trimmedName);

    if (!trimmedName || !slug) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === targetProject.id
          ? {
              ...project,
              name: trimmedName,
              slug,
            }
          : project,
      ),
    );
  };

  const handleDeleteProject = async () => {
    if (!targetProject) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== targetProject.id),
    );
  };

  return (
    <div className="min-h-screen bg-bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
      />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close project sidebar overlay"
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[1px] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projects}
        onCreateProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      <main className="min-h-screen pt-14">
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
          <div className="flex max-w-xl flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-copy-primary">
              Create a project or open an existing one
            </h1>
            <p className="text-sm text-copy-secondary">
              Start a new architecture workspace, or choose a project from the
              sidebar.
            </p>
            <Button type="button" onClick={openCreate}>
              <Plus />
              New Project
            </Button>
          </div>
        </div>
      </main>

      <ProjectDialogContent
        dialogType={dialogType}
        targetProject={targetProject}
        draftName={draftName}
        onDraftNameChange={setDraftName}
        onClose={closeDialog}
        isSubmitting={isSubmitting}
        slugPreview={slugPreview}
        onCreate={() => submit(handleCreateProject)}
        onRename={() => submit(handleRenameProject)}
        onDelete={() => submit(handleDeleteProject)}
      />
    </div>
  );
}
