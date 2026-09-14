import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-bg-base text-copy-primary">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[minmax(0,1fr)_minmax(24rem,34rem)]">
        <section className="hidden flex-col justify-between border-r border-surface-border px-12 py-10 lg:flex xl:px-20">
          <div className="flex items-center gap-3 text-sm font-semibold tracking-wide text-copy-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-sm font-bold text-bg-base">
              T
            </span>
            Tank AI
          </div>
          <div className="max-w-md pb-10">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-brand">
              Architecture workspace
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-copy-primary xl:text-5xl">
              Turn complex systems into clear decisions.
            </h1>
            <ul className="mt-8 space-y-4 text-sm leading-6 text-copy-muted">
              <li>Map ideas into shared system architecture.</li>
              <li>Refine designs with your team in real time.</li>
              <li>Generate technical specifications when ready.</li>
            </ul>
          </div>
        </section>
        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
