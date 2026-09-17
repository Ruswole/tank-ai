"use client";

import { AlertTriangle, Loader2, Plus } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type {
  ProjectDialogType,
  ProjectDialogTarget,
} from "@/components/editor/use-project-dialogs";

interface ProjectDialogContentProps {
  dialogType: ProjectDialogType;
  targetProject: ProjectDialogTarget | null;
  draftName: string;
  slugPreview: string;
  isSubmitting: boolean;
  onDraftNameChange: (value: string) => void;
  onClose: () => void;
  onCreate: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function ProjectDialogContent({
  dialogType,
  targetProject,
  draftName,
  slugPreview,
  isSubmitting,
  onDraftNameChange,
  onClose,
  onCreate,
  onRename,
  onDelete,
}: ProjectDialogContentProps) {
  const renameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (dialogType === "rename") {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [dialogType]);

  const createOpen = dialogType === "create";
  const renameOpen = dialogType === "rename";
  const deleteOpen = dialogType === "delete";

  const hasValidSlug = slugPreview.length > 0;
  const createDisabled =
    draftName.trim().length === 0 || !hasValidSlug || isSubmitting;
  const renameDisabled =
    draftName.trim().length === 0 || !hasValidSlug || isSubmitting;
  const slugValidationMessage =
    draftName.trim().length > 0 && !hasValidSlug
      ? "Use at least one letter or number."
      : null;

  return (
    <>
      <Dialog open={createOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] border border-surface-border bg-[#1d1f24]/95 p-0 shadow-[0_28px_60px_rgba(0,0,0,0.55)]">
          <div className="px-5 pb-2 pt-5">
            <div className="space-y-2">
              <DialogTitle className="text-[1.05rem] font-semibold text-copy-primary">
                New Project
              </DialogTitle>
              <DialogDescription className="text-sm text-copy-muted">
                Give your project a name to get started.
              </DialogDescription>
            </div>
          </div>

          <div className="px-5 pb-4">
            <Input
              id="project-name"
              value={draftName}
              onChange={(event) => onDraftNameChange(event.target.value)}
              placeholder="Project name"
              autoFocus
              className="h-12 w-full rounded-xl border border-[#00c8d4] bg-[#111114] px-3 text-base text-copy-primary placeholder:text-copy-muted focus-visible:border-[#00c8d4] focus-visible:ring-0"
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.nativeEvent.isComposing &&
                  !createDisabled
                ) {
                  onCreate();
                }
              }}
            />

            <div className="mt-3 min-h-6 text-left">
              <p
                className={`text-sm ${
                  slugValidationMessage ? "text-state-error" : "text-copy-muted"
                }`}
              >
                {slugValidationMessage ?? (slugPreview || "project-name")}
              </p>
              {slugValidationMessage && (
                <p className="mt-1 text-xs text-copy-muted">
                  Special characters are converted to hyphens in the slug.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-surface-border/80 bg-[#17191d]/90 px-5 py-4">
            <Button
              type="button"
              onClick={onCreate}
              disabled={createDisabled}
              className="min-w-[9.5rem] rounded-xl bg-[#14c7d4] px-4 py-2.5 text-sm font-medium text-[#0b1215] hover:bg-[#35d6df]"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create Project
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="min-w-[4.5rem] rounded-xl bg-[#2a2d32] px-4 py-2.5 text-sm text-copy-primary hover:bg-[#343942]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={renameOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[min(32rem,calc(100vw-2rem))] rounded-3xl border border-surface-border bg-bg-surface p-0 shadow-2xl shadow-black/30">
          <div className="p-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl text-copy-primary">
                Rename project
              </DialogTitle>
              <DialogDescription className="text-copy-muted">
                Update the project name for{" "}
                {targetProject?.name ?? "this project"}.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="rename-project-name"
                  className="text-sm font-medium text-copy-secondary"
                >
                  Project name
                </label>
                <Input
                  id="rename-project-name"
                  ref={renameInputRef}
                  value={draftName}
                  onChange={(event) => onDraftNameChange(event.target.value)}
                  placeholder="Project name"
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.nativeEvent.isComposing &&
                      !renameDisabled
                    ) {
                      onRename();
                    }
                  }}
                />
              </div>

              <div className="rounded-xl border border-surface-border-subtle bg-bg-subtle px-3 py-2 text-sm">
                <p className="text-copy-muted">Slug preview</p>
                <p
                  className={`mt-1 font-medium ${
                    slugValidationMessage
                      ? "text-state-error"
                      : "text-copy-primary"
                  }`}
                >
                  /{slugPreview || "project-name"}
                </p>
                {slugValidationMessage && (
                  <p className="mt-1 text-xs text-copy-muted">
                    Use at least one letter or number.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 border-t border-surface-border bg-bg-subtle/80 p-4 text-sm">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={onRename} disabled={renameDisabled}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="w-[min(28rem,calc(100vw-2rem))] rounded-3xl border border-surface-border bg-bg-surface p-0 shadow-2xl shadow-black/30">
          <div className="p-6">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl text-copy-primary">
                Delete project
              </DialogTitle>
              <DialogDescription className="text-copy-muted">
                This action deletes the project and all of its generated
                content. This cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <p className="mt-6 text-sm text-copy-secondary">
              Are you sure you want to delete{" "}
              <span className="font-medium text-copy-primary">
                {targetProject?.name ?? "this project"}
              </span>
              ?
            </p>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 border-t border-surface-border bg-bg-subtle/80 p-4 text-sm">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
