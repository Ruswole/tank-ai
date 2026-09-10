import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onToggleSidebar,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-surface-border bg-bg-surface/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center">
          <Button
            aria-label={
              isSidebarOpen ? "Close project sidebar" : "Open project sidebar"
            }
            size="icon"
            variant="ghost"
            onClick={onToggleSidebar}
          >
            <SidebarIcon />
          </Button>
        </div>
        <div aria-hidden="true" />
        <div className="flex min-w-8 items-center justify-end" />
      </div>
    </header>
  );
}
