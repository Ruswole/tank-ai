import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function EmptyProjectState() {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-surface-border-subtle px-4 text-center text-sm text-copy-muted">
      No projects yet
    </div>
  );
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      aria-label="Project sidebar"
      inert={!isOpen}
      className={`fixed top-18 bottom-4 left-4 z-30 flex w-[min(20rem,calc(100vw-2rem))] flex-col rounded-2xl border border-surface-border bg-bg-surface/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-sm transition-transform duration-200 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold text-copy-primary">
          Projects
        </h2>
        <Button
          aria-label="Close project sidebar"
          size="icon-sm"
          variant="ghost"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>

      <Tabs defaultValue="shared" className="mt-5 flex min-h-0 flex-1">
        <TabsList className="w-full bg-bg-subtle">
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="shared" className="mt-4">
          <EmptyProjectState />
        </TabsContent>
        <TabsContent value="projects" className="mt-4">
          <EmptyProjectState />
        </TabsContent>
      </Tabs>

      <Button className="mt-4 w-full" variant="default">
        <Plus />
        New Project
      </Button>
    </aside>
  );
}
