# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Project dialogs (create, rename, and delete)

## Current Goal

- Complete the project dialog flow for creating, renaming, and deleting projects.

## Completed

- Context and design-system specification reviewed.
- shadcn/ui initialized with CSS variables and Lucide icon support.
- Added Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea primitives.
- Added the reusable `cn()` helper in `lib/utils.ts`.
- Added `lucide-react` and supporting class utility dependencies.
- Mapped shadcn semantic tokens to the existing dark workspace palette.
- Validated with TypeScript, ESLint, and a production build.
- Added the reusable editor navbar with sidebar state controls.
- Added the floating project sidebar with Shared and My Projects tabs, empty states, and New Project action.
- Wired the editor shell and `/editor` page to the sidebar toggle interaction.
- Added a separate Tank AI home page at `/` with a link to the editor.
- Added Clerk provider theming with the existing dark CSS variables.
- Added responsive sign-in and sign-up pages using Clerk's built-in components.
- Added default route protection through root `proxy.ts`, with env-configured auth paths public.
- Updated `/` to redirect authenticated users to `/editor` and unauthenticated users to `/sign-in`.
- Added Clerk's built-in `UserButton` to the editor navbar.
- Updated the auth shell to use an equal 50/50 layout with a tinted left panel.
- Applied the Geist Sans font variables to Clerk's hosted authentication UI.
- Remediated all seven high-severity npm audit findings by upgrading `@clerk/ui` and pinning Prisma to the secure `6.12.0` release.
- Allowed the home route through Clerk middleware so local auth pages are rendered instead of the hosted account flow.
- Adjusted the auth split breakpoint and column sizing for medium desktop viewports without horizontal overflow.
- Refined the auth panel content and accent treatment to match the approved reference composition.
- Added the Prisma project and collaborator models with ownership, cascade deletion, uniqueness, and query indexes.
- Added the server-only cached Prisma client singleton with direct PostgreSQL and Accelerate URL branches.
- Created and applied the initial Prisma migration and regenerated the Prisma client successfully.

## In Progress

- Editor home layout and project dialog flow for create, rename, and delete actions.
- Added live slug preview beneath the project name input in the create dialog so the generated URL-style name updates as the user types.
- Refined the project sidebar to match the reference layout with first-positioned My Projects tabs, flatter rows, and quieter hover actions.

## Next Up

- Validate the project dialog interactions and connect their actions to persistence.

## Open Questions

- Add unresolved product or implementation questions here.
- Clerk environment variables must be provided by the local environment for runtime auth.
- Sign-in and sign-up URL variables are optional; the proxy defaults to `/sign-in` and `/sign-up` when they are absent.
- `DATABASE_URL` must be provided by the local environment for Prisma runtime and migrations.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- Generated files under `components/ui/` were left unmodified after shadcn installation.
- Editor chrome will use a client shell for sidebar state while keeping reusable presentational components focused.
- Clerk owns authentication flows, profile settings, and logout; application code only configures the provider, routes, and appearance.
- Auth pages use the Tank AI two-panel brand layout on large screens and show only the centered Clerk form on small screens.
- Prisma uses `@prisma/adapter-pg` for direct PostgreSQL URLs and `@prisma/extension-accelerate` only for `prisma+postgres://` URLs; database credentials remain server-only.
