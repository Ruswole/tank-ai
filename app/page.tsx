import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-base px-6">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center">
        <h1 className="font-heading text-5xl font-semibold tracking-tight text-copy-primary">
          Tank AI
        </h1>
        <p className="text-copy-muted">
          Design and refine system architectures with an AI-assisted workspace.
        </p>
        <Link
          href="/editor"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-brand px-5 text-sm font-medium text-bg-base transition-colors hover:bg-brand/90"
        >
          Open editor
        </Link>
      </div>
    </main>
  );
}
