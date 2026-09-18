"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogContent } from "@/components/editor/project-dialogs";
import {
  ProjectSidebar,
  type ProjectSidebarItem,
} from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function buildProjectSlug(
  value: string,
  projects: ProjectSidebarItem[],
  currentId?: string,
) {
  const baseSlug = slugify(value);

  if (!baseSlug) {
    return "";
  }

  const generateSuffix = () =>
    Math.random().toString(36).slice(2, 8).padEnd(5, "0");

  let suffix = generateSuffix();
  let candidate = `${baseSlug}-${suffix}`;
  let attempt = 0;

  while (
    attempt < 10 &&
    projects.some(
      (project) =>
        project.id !== currentId && slugify(project.name) === candidate,
    )
  ) {
    suffix = generateSuffix();
    candidate = `${baseSlug}-${suffix}`;
    attempt += 1;
  }

  return candidate;
}

interface EditorShellProps {
  initialProjects?: {
    ownedProjects: ProjectSidebarItem[];
    sharedProjects: ProjectSidebarItem[];
  };
}

export function EditorShell({
  initialProjects = { ownedProjects: [], sharedProjects: [] },
}: EditorShellProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<ProjectSidebarItem[]>([
    ...initialProjects.ownedProjects,
    ...initialProjects.sharedProjects,
  ]);
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

  const slugPreview = useMemo(
    () => buildProjectSlug(draftName, projects, targetProject?.id),
    [draftName, projects, targetProject?.id],
  );

  const refreshProjectList = async () => {
    const response = await fetch("/api/projects", { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as {
      projects?: Array<{ id: string; name: string }>;
    };
    const nextProjects = (payload.projects ?? []).map((project) => ({
      id: project.id,
      name: project.name,
      owner: "owned" as const,
      slug: slugify(project.name),
    }));

    setProjects(nextProjects);
  };

  const handleCreateProject = async () => {
    const trimmedName = draftName.trim();
    const slug = buildProjectSlug(trimmedName, projects);

    if (!trimmedName || !slug) {
      return;
    }

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: trimmedName }),
    });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as {
      project?: { id: string; name: string };
    };
    const project = payload.project;

    if (!project) {
      return;
    }

    setProjects((currentProjects) => [
      {
        id: project.id,
        name: project.name,
        owner: "owned",
        slug: slugify(project.name),
      },
      ...currentProjects,
    ]);

    router.push(`/editor?project=${project.id}`);
  };

  const handleRenameProject = async () => {
    if (!targetProject) {
      return;
    }

    const trimmedName = draftName.trim();
    const slug = buildProjectSlug(trimmedName, projects, targetProject.id);

    if (!trimmedName || !slug) {
      return;
    }

    const response = await fetch(`/api/projects/${targetProject.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: trimmedName }),
    });

    if (!response.ok) {
      return;
    }

    await refreshProjectList();
  };

  const handleDeleteProject = async () => {
    if (!targetProject) {
      return;
    }

    const response = await fetch(`/api/projects/${targetProject.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }

    const nextProjects = projects.filter(
      (project) => project.id !== targetProject.id,
    );
    setProjects(nextProjects);

    if (typeof window !== "undefined") {
      const currentProjectId = new URLSearchParams(window.location.search).get(
        "project",
      );
      if (currentProjectId === targetProject.id) {
        router.push("/editor");
      }
    }
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
        onRenameProject={(project) =>
          openRename({ ...project, slug: slugify(project.name) })
        }
        onDeleteProject={(project) =>
          openDelete({ ...project, slug: slugify(project.name) })
        }
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
