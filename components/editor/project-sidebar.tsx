import { PencilLine, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ProjectSidebarItem {
  id: string;
  name: string;
  owner: "owned" | "shared";
  slug: string;
}

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectSidebarItem[];
  selectedProjectId?: string;
  onCreateProject?: () => void;
  onRenameProject?: (project: ProjectSidebarItem) => void;
  onDeleteProject?: (project: ProjectSidebarItem) => void;
}

function EmptyProjectState() {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-surface-border-subtle px-4 text-center text-sm text-copy-muted">
      No projects yet
    </div>
  );
}

function ProjectList({
  items,
  selectedProjectId,
  onRenameProject,
  onDeleteProject,
}: {
  items: ProjectSidebarItem[];
  selectedProjectId?: string;
  onRenameProject?: (project: ProjectSidebarItem) => void;
  onDeleteProject?: (project: ProjectSidebarItem) => void;
}) {
  if (items.length === 0) {
    return <EmptyProjectState />;
  }

  return (
    <div className="space-y-1">
      {items.map((project) => {
        const isSelected = selectedProjectId === project.id;

        return (
          <div
            key={project.id}
            className={`group flex min-h-11 items-center justify-between gap-2 rounded-xl px-2.5 py-2 transition-all ${
              isSelected
                ? "border border-transparent bg-[color:var(--accent-primary-dim)] shadow-inner shadow-black/20"
                : "border border-transparent hover:bg-bg-elevated"
            }`}
          >
            <Link
              href={`/editor/${project.id}`}
              aria-current={isSelected ? "page" : undefined}
              className="flex min-w-0 flex-1 items-center gap-2 text-left"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isSelected
                    ? "bg-brand shadow-[0_0_0_4px_rgba(0,200,212,0.14)]"
                    : "bg-copy-faint"
                }`}
              />
              <span className="truncate text-sm font-medium text-copy-primary">
                {project.name}
              </span>
            </Link>

            {project.owner === "owned" &&
              onRenameProject &&
              onDeleteProject && (
                <div className="flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    className="text-copy-secondary hover:bg-bg-subtle"
                    aria-label={`Rename ${project.name}`}
                    onClick={() => onRenameProject(project)}
                  >
                    <PencilLine className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    className="text-state-error hover:bg-bg-subtle"
                    aria-label={`Delete ${project.name}`}
                    onClick={() => onDeleteProject(project)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  selectedProjectId,
  projects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const sharedProjects = projects.filter(
    (project) => project.owner === "shared",
  );
  const ownedProjects = projects.filter((project) => project.owner === "owned");

  return (
    <aside
      aria-hidden={!isOpen}
      aria-label="Project sidebar"
      inert={!isOpen}
      className={`fixed bottom-0 left-0 top-14 z-30 flex w-[min(22.5rem,100vw)] flex-col border-r border-surface-border bg-bg-surface/95 px-3 pb-4 pt-4 shadow-2xl shadow-black/20 backdrop-blur-sm transition-transform duration-200 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-2">
        <h2 className="text-lg font-semibold text-copy-primary">Projects</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          aria-label="Close project sidebar"
          className="text-copy-secondary hover:bg-bg-subtle"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-4 min-h-0 flex-1">
        <Tabs defaultValue="projects" className="flex h-full min-h-0 flex-col">
          <TabsList className="h-10 w-full justify-start gap-0 rounded-xl bg-bg-subtle p-0.5">
            <TabsTrigger
              value="projects"
              className="h-9 flex-1 rounded-lg text-sm data-[state=active]:bg-bg-base data-[state=active]:text-copy-primary"
            >
              My Projects
            </TabsTrigger>
            <TabsTrigger
              value="shared"
              className="h-9 flex-1 rounded-lg text-sm data-[state=active]:bg-bg-base data-[state=active]:text-copy-primary"
            >
              Shared
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="shared"
            className="mt-5 min-h-0 flex-1 overflow-y-auto"
          >
            <ProjectList
              items={sharedProjects}
              selectedProjectId={selectedProjectId}
              onRenameProject={onRenameProject}
              onDeleteProject={onDeleteProject}
            />
          </TabsContent>
          <TabsContent
            value="projects"
            className="mt-5 min-h-0 flex-1 overflow-y-auto"
          >
            <ProjectList
              items={ownedProjects}
              selectedProjectId={selectedProjectId}
              onRenameProject={onRenameProject}
              onDeleteProject={onDeleteProject}
            />
          </TabsContent>
        </Tabs>
      </div>

      {onCreateProject && (
        <div className="mt-4">
          <Button
            className="h-11 w-full rounded-xl bg-brand text-bg-base hover:bg-brand/90"
            variant="default"
            onClick={onCreateProject}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      )}
    </aside>
  );
}
