"use client";

import { Check, Link2, Loader2, Mail, Trash2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Collaborator {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
}

interface OwnerProfile {
  email: string | null;
  name: string | null;
  imageUrl: string | null;
}

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  isOwner: boolean;
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  isOwner,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [owner, setOwner] = useState<OwnerProfile | null>(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;
    fetch(`/api/projects/${projectId}/collaborators`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load collaborators.");
        }
        return (await response.json()) as {
          owner?: OwnerProfile;
          collaborators?: Collaborator[];
        };
      })
      .then((payload) => {
        if (active) {
          setCollaborators(payload.collaborators ?? []);
          setOwner(payload.owner ?? null);
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load collaborators.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [open, projectId]);

  const inviteCollaborator = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const response = await fetch(`/api/projects/${projectId}/collaborators`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(payload?.error ?? "Unable to invite collaborator.");
      setIsSubmitting(false);
      return;
    }

    setEmail("");
    setIsSubmitting(false);
    await refreshCollaborators();
  };

  const refreshCollaborators = async () => {
    const response = await fetch(`/api/projects/${projectId}/collaborators`, {
      cache: "no-store",
    });
    if (response.ok) {
      const payload = (await response.json()) as {
        collaborators?: Collaborator[];
      };
      setCollaborators(payload.collaborators ?? []);
    }
  };

  const removeCollaborator = async (collaboratorEmail: string) => {
    setError(null);
    const response = await fetch(`/api/projects/${projectId}/collaborators`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: collaboratorEmail }),
    });
    if (!response.ok) {
      setError("Unable to remove collaborator.");
      return;
    }
    setCollaborators((current) =>
      current.filter(({ email: itemEmail }) => itemEmail !== collaboratorEmail),
    );
  };

  const copyProjectLink = async () => {
    await navigator.clipboard.writeText(
      `${window.location.origin}/editor/${projectId}`,
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(40rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-surface-border bg-bg-surface p-0 text-copy-primary shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <div className="border-b border-surface-border px-8 pb-5 pt-5">
          <DialogTitle className="text-[1rem] font-semibold tracking-[-0.01em]">
            Share project
          </DialogTitle>
          <DialogDescription className="mt-1 text-[0.8rem] text-copy-muted">
            Invite collaborators, copy the workspace link, and manage access.
          </DialogDescription>
        </div>

        <div className="space-y-4 px-8 py-6">
          <div className="rounded-2xl border border-surface-border bg-bg-base/45 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium text-copy-primary">
                  Workspace link
                </p>
                <p className="mt-1 text-xs text-copy-muted">
                  Share a direct link with teammates after you grant them
                  access.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={copyProjectLink}
                className="h-8 rounded-lg border-surface-border bg-bg-base px-3 text-xs text-copy-secondary hover:bg-bg-subtle hover:text-copy-primary"
              >
                {copied ? <Check className="text-state-success" /> : <Link2 />}
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </div>
          </div>

          {isOwner && (
            <div className="rounded-2xl border border-surface-border bg-bg-base/45 p-3">
              <div className="flex gap-2">
                <Input
                  id="collaborator-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) =>
                    event.key === "Enter" && inviteCollaborator()
                  }
                  placeholder="teammate@company.com"
                  className="h-10 rounded-xl border-surface-border bg-bg-base text-sm text-copy-primary placeholder:text-copy-muted"
                />
                <Button
                  type="button"
                  onClick={inviteCollaborator}
                  disabled={isSubmitting || !email.trim()}
                  className="h-10 rounded-xl bg-brand px-4 text-xs font-semibold text-bg-base hover:bg-brand/85"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <UserPlus />
                  )}
                  Invite
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-copy-primary">
                People with access
              </p>
              <span className="text-xs text-copy-muted">
                {collaborators.length + (owner ? 1 : 0)} total
              </span>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-5 text-copy-muted">
                <Loader2 className="animate-spin" />
              </div>
            ) : !owner && collaborators.length === 0 ? (
              <p className="rounded-xl border border-dashed border-surface-border p-4 text-sm text-copy-muted">
                No collaborators yet.
              </p>
            ) : (
              <div className="space-y-2">
                {owner && (
                  <div className="flex min-h-20 items-center gap-4 rounded-2xl border border-surface-border bg-bg-base/45 px-4 py-3">
                    {owner.imageUrl ? (
                      <img
                        src={owner.imageUrl}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-copy-muted">
                        <Mail className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <p className="min-w-0 truncate text-base font-medium text-copy-primary">
                          {owner.name ?? owner.email}
                        </p>
                        <span className="shrink-0 rounded-full border border-brand/40 bg-accent-dim px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-brand">
                          Owner
                        </span>
                      </div>
                      <p className="truncate text-xs text-copy-muted">
                        {owner.email}
                      </p>
                    </div>
                  </div>
                )}
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex min-h-[5.5rem] items-center gap-4 rounded-2xl border border-surface-border bg-bg-base/45 px-4 py-3"
                  >
                    {collaborator.imageUrl ? (
                      <img
                        src={collaborator.imageUrl}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-copy-muted">
                        <Mail className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <p className="min-w-0 truncate text-base font-medium text-copy-primary">
                          {collaborator.name ?? collaborator.email}
                        </p>
                        <span className="shrink-0 rounded-full border border-surface-border bg-bg-subtle px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-copy-secondary">
                          Collaborator
                        </span>
                      </div>
                      {collaborator.name && (
                        <p className="truncate text-xs text-copy-muted">
                          {collaborator.email}
                        </p>
                      )}
                    </div>
                    {isOwner && (
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Remove ${collaborator.email}`}
                        onClick={() => removeCollaborator(collaborator.email)}
                        className="h-10 w-10 shrink-0 rounded-xl border border-surface-border bg-bg-subtle text-copy-muted hover:border-state-error/50 hover:text-state-error"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-state-error">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
