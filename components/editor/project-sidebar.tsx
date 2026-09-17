import { PencilLine, Plus, Trash2 } from "lucide-react";

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
  onCreateProject: () => void;
  onRenameProject: (project: ProjectSidebarItem) => void;
  onDeleteProject: (project: ProjectSidebarItem) => void;
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
  onRenameProject,
  onDeleteProject,
}: {
  items: ProjectSidebarItem[];
  onRenameProject: (project: ProjectSidebarItem) => void;
  onDeleteProject: (project: ProjectSidebarItem) => void;
}) {
  if (items.length === 0) {
    return <EmptyProjectState />;
  }

  return (
    <div className="space-y-1">
      {items.map((project) => (
        <div
          key={project.id}
          className="group flex min-h-12 items-center justify-between gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-bg-elevated"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-copy-primary">
              {project.name}
            </p>
          </div>

          {project.owner === "owned" && (
            <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100">
              {" "}
              <Button
                type="button"
                size="xs"
                variant="ghost"
                className="text-copy-secondary"
                aria-label={`Rename ${project.name}`}
                onClick={() => onRenameProject(project)}
              >
                <PencilLine className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Rename</span>
              </Button>
              <Button
                type="button"
                size="xs"
                variant="ghost"
                className="text-state-error"
                aria-label={`Delete ${project.name}`}
                onClick={() => onDeleteProject(project)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
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
      className={`fixed top-14 bottom-0 left-0 z-30 flex w-[min(22.5rem,100vw)] flex-col border-r border-surface-border bg-bg-surface/95 px-2 pb-4 pt-5 shadow-2xl shadow-black/20 backdrop-blur-sm transition-transform duration-200 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Tabs defaultValue="projects" className="flex min-h-0 flex-1 flex-col">
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
        <TabsContent value="shared" className="mt-7 min-h-0 overflow-y-auto">
          <ProjectList
            items={sharedProjects}
            onRenameProject={onRenameProject}
            onDeleteProject={onDeleteProject}
          />
        </TabsContent>
        <TabsContent value="projects" className="mt-7 min-h-0 overflow-y-auto">
          <ProjectList
            items={ownedProjects}
            onRenameProject={onRenameProject}
            onDeleteProject={onDeleteProject}
          />
        </TabsContent>
      </Tabs>

      <Button
        className="mt-4 h-10 w-full rounded-xl"
        variant="default"
        onClick={onCreateProject}
      >
        <Plus />
        New Project
      </Button>
    </aside>
  );
}
