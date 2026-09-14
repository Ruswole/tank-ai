import type { ReactNode } from "react";
import { FileText, Network, Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-base text-copy-primary">
      <div className="grid min-h-screen md:grid-cols-2">
        <section className="hidden min-w-0 flex-col justify-between border-r border-surface-border bg-bg-surface px-8 py-10 md:flex lg:px-12 xl:px-20">
          <div className="flex items-center gap-3 text-sm font-semibold tracking-wide text-copy-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-sm font-bold text-bg-base">
              T
            </span>
            Tank AI
          </div>
          <div className="max-w-xl pb-10">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-brand">
              Architecture workspace
            </p>
            <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight text-copy-primary xl:text-5xl">
              Design systems at the speed of thought.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-6 text-copy-muted">
              Describe your architecture in plain English. Tank AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
            <ul className="mt-9 space-y-5 text-sm text-copy-secondary">
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/30 bg-accent-dim text-brand">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                <span>
                  <strong className="block font-medium text-copy-primary">
                    AI Architecture Generation
                  </strong>
                  <span className="mt-1 block text-copy-muted">
                    Describe your system and map it to nodes and edges.
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/30 bg-accent-dim text-brand">
                  <Network className="h-3.5 w-3.5" />
                </span>
                <span>
                  <strong className="block font-medium text-copy-primary">
                    Real-time Collaboration
                  </strong>
                  <span className="mt-1 block text-copy-muted">
                    Refine designs with your team in real time.
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/30 bg-accent-dim text-brand">
                  <FileText className="h-3.5 w-3.5" />
                </span>
                <span>
                  <strong className="block font-medium text-copy-primary">
                    Instant Spec Generation
                  </strong>
                  <span className="mt-1 block text-copy-muted">
                    Export a complete technical spec from your canvas graph.
                  </span>
                </span>
              </li>
            </ul>
          </div>
          <p className="text-xs text-copy-faint">
            (c) 2026 Tank AI. All rights reserved.
          </p>
        </section>
        <section className="flex min-w-0 items-center justify-center px-6 py-10 sm:px-10 md:px-8 lg:px-12">
          <div className="w-full min-w-0 max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
