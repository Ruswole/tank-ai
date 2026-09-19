import { PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projectName?: string;
  actions?: ReactNode;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
  projectName,
  actions,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-surface-border bg-bg-surface/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between gap-3 px-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            aria-label={
              isSidebarOpen ? "Close project sidebar" : "Open project sidebar"
            }
            size="icon"
            variant="ghost"
            onClick={onToggleSidebar}
            className="border border-transparent bg-transparent text-copy-secondary hover:bg-bg-subtle hover:text-copy-primary"
          >
            <SidebarIcon className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-bg-base/80 px-2.5 py-1.5 shadow-inner shadow-black/20">
            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-surface-border-subtle bg-bg-elevated text-[9px] font-semibold text-copy-primary">
              N
            </div>
            <div className="min-w-0 leading-none">
              <p className="text-[9px] uppercase tracking-[0.2em] text-copy-faint">
                New Spec
              </p>
              <p className="mt-0.5 truncate text-[11px] font-medium text-copy-secondary">
                {projectName ?? "Workspace"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions ?? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-surface-border bg-bg-base/70 text-copy-secondary"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
          )}
          <div className="flex items-center gap-2">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
