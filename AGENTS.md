<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# OpenDayCare

App for a daycare ("guardería"): staff post each child's daily moments and families follow along. Two roles in the designs: staff and family/parents.

## Design source of truth
- `references/pantallas/*.dc.html` — one interactive comp per screen (self-contained HTML, open directly in a browser). These define layout, copy, and styling; build UI from them, don't invent.
- `references/screenshots/*.png` — static captures of the key screens.
- UI copy is Spanish (Argentine voseo: "Publicá", "Ingresá").
- Design system: Fredoka (headings) + Nunito (body), Google Fonts; warm palette (bg `#FBF4EC`, coral gradient `#F6A98E`→`#EC7E62`, text `#3F362E`). The scaffold's default Geist font and neutral palette must be replaced.

## Commands
- `npm run dev` (port 3000), `npm run build`, `npm start`
- `npm run lint` — plain `eslint` (flat config, no file args). `next lint` no longer exists in Next 16.
- No test framework configured. `npm run build` is the typecheck gate (no separate typecheck script).

## Stack notes
- Next.js 16 App Router, React 19, TypeScript strict. Path alias `@/*` → repo root.
- Tailwind CSS v4: CSS-first config via `@theme` in `app/globals.css`; there is no `tailwind.config.*`.

## MCPs
- Playwright: all screenshots and Playwright output go in `.playwright-mcp/`.
- Context7: use it for current framework docs (Next 16 differs from training data).

## Workflow
- `spec` / `spec-impl` / `spec-verify` skills are installed for spec-driven feature work; prefer starting new features with the `spec` skill.
- `spec` Usa esta habilidad para crear las especificaciones
- `spec-impl` Usa esta habilidad para hacer las implementaciones
- `spec-verify` Usa esta habilidad para verificar los criterios de aceptación de una especificación ya implementada

## Code Rules
- Usar código limpio, nombres, funciones, variables, etc, en inglés.
