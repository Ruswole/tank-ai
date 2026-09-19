import { LockKeyhole } from "lucide-react";
import Link from "next/link";

export function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-base px-6 text-copy-primary">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-border bg-bg-surface text-brand">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Project access denied</h1>
          <p className="mt-2 text-sm text-copy-muted">
            This project does not exist or you do not have access to it.
          </p>
        </div>
        <Link
          href="/editor"
          className="text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          Back to editor
        </Link>
      </div>
    </main>
  );
}
