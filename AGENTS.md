<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Angleo

Personal site of Nicole Kurek — English trainer (business English), Polish-language audience.
Content migrated from the Webflow site at angleo.pl.

## Stack

- Next.js 16.4.2 (App Router, `cacheComponents` on), React 19.3.0
- Tailwind 4 — `@import 'tailwindcss'` in `app/globals.css`; tokens in
  `app/styles/tokens.css`. **No `tailwind.config.*`.**
- TypeScript (strict), ESLint + Prettier
- Content: typed data in `content/site.ts` (single page — no MDX needed yet)
- Hosting: Vercel

## Commands

```bash
pnpm dev            # dev server
pnpm build          # production build — run before claiming things compile
pnpm check          # format:check + lint + typecheck — the gate
pnpm check:meta     # meta & OG audit (needs a build + running server)
```

`check:meta` runs `scripts/check-meta.mts` through `tsx` (ESM, for top-level await) rather than
`node --experimental-strip-types`, because the pinned Node (`.nvmrc`) is 20.x.

<!-- BEGIN:altalogy/tooling -->

Formatting and linting are enforced by a pre-commit hook and by CI. After editing files,
run `pnpm check` and fix what it reports. Never commit with `--no-verify`.

- **Formatting is Prettier's** — don't hand-format, don't argue with its output.
- **Tailwind class order is automatic.** Write classes in any order; the formatter sorts.

<!-- END:altalogy/tooling -->

## Project structure

```text
app/           # Root layout (html/body/fonts) + page.tsx
  styles/      # tokens.css, utilities/layout.css
components/
  ui/          # Section, Container, ButtonLink
  text/        # Text, Heading
sections/home/ # Hero, About, Topics, Contact
layouts/       # MainLayout, Header, Footer
content/       # site.ts — all copy lives here
lib/
  metadata.ts  # buildMetadata()
  meta-audit/  # Meta & OG audit module
scripts/       # check-meta.mts
public/        # og.svg, images/
.altalogy/     # Our working record
```

Import via `@/`. Never `../` across top-level folders.

```text
page → MainLayout → sections → Section → container → content
```

## Design direction

> No Figma yet. Placeholder direction: warm, calm, personal — cream background, a tan/brown
> accent taken from the portrait, serif display headings (Fraunces) over a clean sans
> (Inter). Friendly and professional; deliberately _not_ a corporate language school.

**Replace this block with the designer's direction once a Figma exists.**

- **Figma:** — (none yet)

## Design system

Tokens in `app/styles/tokens.css`. **Extend the tokens before reaching for an arbitrary
value.**

| Token                 | Tailwind                    | Usage                   |
| --------------------- | --------------------------- | ----------------------- |
| `--background`        | `bg-background`             | Page background         |
| `--foreground`        | `text-foreground`           | Primary text            |
| `--foreground-muted`  | `text-foreground-muted`     | Secondary copy          |
| `--surface`           | `bg-surface`                | Alternate section bands |
| `--border`            | `border-border`             | Hairlines, card borders |
| `--accent`            | `bg-accent` / `text-accent` | CTAs, eyebrows          |
| `--accent-foreground` | `text-accent-foreground`    | Text on accent          |

- **Typography:** `Text` and `Heading` from `components/text/`. One `h1` per page.
  Headings use `font-display` (Fraunces), body `font-sans` (Inter).
- **Spacing:** layout utilities (`px-container`, `py-section`, `max-w-content`), not raw
  `p-4` / `text-lg`, unless no token exists.

## Conventions

- Prefer Server Components; `'use client'` only when the component needs it.
- **No arbitrary Tailwind values** (`text-[#333]`) — use tokens.
- **No inline `style={...}`** unless unavoidable (CSS variables for animation).
- Images through `next/image` with explicit dimensions.
- PascalCase components, `useThing.ts` hooks, lowercase modules.
- Copy is Polish; `<html lang="pl">`.

<!-- BEGIN:altalogy/code-review -->

## AI code review (`/review`)

### 1. Context

```bash
git diff main...HEAD
git log main...HEAD --oneline
```

### 2. Checklist

- **Code quality** — clear naming; no dead code, commented blocks, or debug logs; reuse
  existing logic.
- **TypeScript** — no implicit `any`; no unjustified `as`.
- **React / Next.js** — no unnecessary `'use client'`; correct list keys; dynamic import
  for heavy client bundles.
- **Tailwind** — token classes only; no redundant class stacks.
- **Accessibility** — visible focus states, labelled controls, one `h1`, alt text,
  `prefers-reduced-motion` respected.
- **Performance** — images sized and modern-format; no large client bundles.
- **Security** — no secrets; input sanitised; no unsafe `dangerouslySetInnerHTML`.
- **Meta** — new routes have title, description, canonical, OG tags.

### 3. Output

- 2–3 sentence summary of what changed.
- Issues by severity: 🔴 Critical · 🟡 Warning · 🟢 Suggestion — file + line, problem, fix.
- Verdict: **Approve** / **Approve with suggestions** / **Needs changes**.

<!-- END:altalogy/code-review -->

## Documenting new features

After a non-trivial feature ships, add to `## Features`: routes, sections, content paths,
new tokens, one-line gotchas. When a section outgrows this file, move it to
`docs/specs/<feature>.md` and link it below.

## Features

| Route | Sections                     | Notes                                                                 |
| ----- | ---------------------------- | --------------------------------------------------------------------- |
| `/`   | Hero, About, Topics, Contact | Copy from `content/site.ts`; anchors `#o-mnie`, `#tematy`, `#kontakt` |

<!-- BEGIN:altalogy/mcp -->

## When this file doesn't answer it

The Dev Guidelines MCP has the general guidance — checklists, flows, tool research, stack
reasoning. **Reach for it only when this file and the code don't answer the question.**
Regular work should not need it. If you look something up that a future task would also
need, add it here afterwards.

<!-- END:altalogy/mcp -->

## Related docs

- `README.md` — run + deploy, written for the client's developer
- `.altalogy/BUILD.md` — the plan and the decisions behind it
- `.altalogy/CHECKLIST.md` — the Ready for Dev and Hand-off gates
