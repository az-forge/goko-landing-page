<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Verification

- `pnpm exec tsc --noEmit`, `pnpm lint` and `pnpm build` must pass.
- `pnpm dev` serves the page. The hero 3D scene is client-only (`src/components/scene/`), so check it in a real browser, not from the HTML.
- Product claims and install commands come from the `goko` repo's `README.md` and `ARCHITECTURE.md`. Screenshots in `public/shots/` are headless snapshots of a debug build of the `release` branch (`goko-rune --script S.json --snap out.png --size 1280x780 --scale 2 --chrome`, with a scratch `GOKO_HOME` and demo repos), so they need no screen-recording permission.
- `/changelog` renders `content/CHANGELOG.md`, a copy of the `goko` repo's `CHANGELOG.md`; run `pnpm sync:changelog` after a release. `src/lib/changelog.ts` expects `## [version] - YYYY-MM-DD`, `### Group` and flat `- ` bullets.
- The Benchmarks section (`src/components/benchmarks.tsx`) and the "Measured results" list in `public/llms.txt` quote numbers from `content/CHANGELOG.md` only. Do not add a number that is not in the changelog.
- Agent logos in `public/agents/` come from `@lobehub/icons-static-svg` (MIT).
- Set `NEXT_PUBLIC_SITE_URL` to the production origin: canonical, Open Graph, `robots.txt`, `sitemap.xml` and JSON-LD all read it from `src/lib/site.ts`. `public/llms.txt` and the FAQ in `src/lib/site.ts` must stay in sync with the page copy.
