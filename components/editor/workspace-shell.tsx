"use client";

import { Bot, Share2, Sparkles, Workflow } from "lucide-react";
import { useState } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ShareDialog } from "@/components/editor/share-dialog";
import {
  ProjectSidebar,
  type ProjectSidebarItem,
} from "@/components/editor/project-sidebar";
import { Button } from "@/components/ui/button";

interface WorkspaceShellProps {
  project: ProjectSidebarItem;
  projects: ProjectSidebarItem[];
}

export function WorkspaceShell({ project, projects }: WorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((isOpen) => !isOpen)}
        projectName={project.name}
        actions={
          <>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-surface-border bg-bg-base/70 text-copy-secondary"
              onClick={() => setIsShareDialogOpen(true)}
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
            <Button
              type="button"
              size="icon"
              variant={isAiSidebarOpen ? "secondary" : "ghost"}
              aria-label={
                isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
              }
              aria-pressed={isAiSidebarOpen}
              onClick={() => setIsAiSidebarOpen((isOpen) => !isOpen)}
              className={
                isAiSidebarOpen
                  ? "border border-surface-border bg-bg-subtle text-copy-primary"
                  : "text-copy-secondary hover:bg-bg-subtle"
              }
            >
              <Bot className="h-4 w-4" />
            </Button>
          </>
        }
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
        selectedProjectId={project.id}
      />

      <main
        className={`flex min-h-screen pt-14 transition-all duration-200 ${
          isSidebarOpen ? "md:pl-[22.5rem]" : ""
        } ${isAiSidebarOpen ? "md:pr-[18rem]" : ""}`}
      >
        <section className="relative flex min-w-0 flex-1 items-center justify-center px-2 py-2 sm:px-3">
          <div className="workspace-grid relative flex h-[calc(100vh-5.5rem)] w-full min-w-0 items-center justify-center overflow-hidden rounded-[2rem] border border-surface-border bg-[radial-gradient(circle_at_center,_rgba(17,17,20,0.96),_rgba(8,8,9,1))]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,200,212,0.12),_transparent_32%)]" />
            <div className="relative z-10 flex max-w-[33rem] flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-brand bg-bg-subtle/80 text-brand shadow-[0_0_0_6px_rgba(0,200,212,0.12)]">
                <Workflow className="h-7 w-7" />
              </div>

              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-copy-faint">
                Workspace shell
              </p>

              <h1 className="max-w-[22ch] text-4xl font-semibold leading-[0.98] tracking-[-0.04em] text-copy-primary sm:text-[3.25rem]">
                Canvas and collaboration tooling land here next.
              </h1>

              <p className="max-w-[34rem] text-base leading-7 text-copy-muted">
                This room is ready for the shared architecture canvas, durable
                AI workflows, and real-time presence. For now, the shell is
                wired with project context and navigation only.
              </p>
            </div>
          </div>
        </section>

        {isAiSidebarOpen && (
          <aside className="fixed inset-y-14 right-0 z-30 flex h-[calc(100vh-3.5rem)] w-[min(18rem,100vw)] flex-col border-l border-surface-border bg-bg-surface/95 p-4 shadow-2xl shadow-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3 border-b border-surface-border pb-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-copy-faint">
                  AI Copilot
                </p>
                <p className="mt-1 text-xs text-copy-muted">
                  Placeholder panel
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-surface-border bg-bg-subtle text-accent-ai">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-4 h-32 shrink-0 overflow-hidden rounded-2xl border border-surface-border bg-bg-subtle/80 p-3">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-surface-border bg-bg-elevated text-accent-ai">
                  <Bot className="h-4 w-4" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-copy-faint">
                  Chat surface pending
                </p>
              </div>
              <p className="text-xs leading-5 text-copy-muted">
                The toggle is wired. Messaging and generation are intentionally
                out of scope here.
              </p>
            </div>

            <div className="min-h-0 flex-1" aria-hidden="true" />

            <div className="mt-6 shrink-0 rounded-2xl border border-surface-border bg-bg-subtle/60 p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-copy-faint">
                Future hooks
              </p>
              <p className="mt-2 text-xs leading-5 text-copy-secondary">
                Prompt composer, run status, and architecture guidance will
                attach to this sidebar.
              </p>
              <div className="mt-3 flex justify-end">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-surface-border bg-bg-elevated text-[10px] font-medium text-copy-secondary">
                  JS
                </div>
              </div>
            </div>
          </aside>
        )}
      </main>

      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        projectId={project.id}
        isOwner={project.owner === "owned"}
      />
    </div>
  );
}
