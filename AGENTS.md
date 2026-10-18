<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Angleo

Personal site + blog of Nicole Kurek — English trainer (business English), Polish-language
audience. A Next.js rebuild of the Webflow site at angleo.pl: same design, same URLs, all posts
migrated to MDX.

## Stack

- Next.js 16.4.2 (App Router, `cacheComponents` on), React 19.3.0
- Tailwind 4 — `@import 'tailwindcss'` in `app/globals.css`; tokens in
  `app/styles/tokens.css`. **No `tailwind.config.*`.**
- TypeScript (strict), ESLint + Prettier
- Content: MDX in repo (`@next/mdx`) — post bodies in `content/blog/*.mdx`, post metadata
  in `content/blog/posts.ts`, site copy in `content/site.ts`
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
app/                         # Routes + root layout (html/body/fonts)
  page.tsx                   # / — featured hero, category bar, post feed + sidebar
  blog/[slug]/               # /blog/<slug> — post
  blog-post-categories/[slug]/ # category listing (old Webflow URL kept)
  o-mnie/ · umow-lekcje/     # about · contact & booking
  styles/                    # tokens.css, utilities/layout.css
components/
  ui/                        # Section, Container, Button, Icon
  text/                      # Text, Heading
  blog/                      # PostListItem, FeaturedCard, PostMeta, Sidebar, PostFeed, CategoryBadge/Tags
sections/                    # Route-specific blocks: home/, blog/, about/
layouts/                     # MainLayout, Header, Footer
content/
  site.ts                    # Site-wide copy, contact details
  about.mdx                  # /o-mnie body
  blog/posts.ts              # Post metadata (newest first) + featured/popular picks
  blog/categories.ts         # Categories (order = category bar)
  blog/<slug>.mdx            # Post bodies
mdx-components.tsx           # MDX element styles (Webflow rich-text) + <Figure>
lib/
  blog.ts                    # Post/category helpers, date format, seoTitle()
  metadata.ts                # buildMetadata()
  meta-audit/                # Meta & OG audit module
scripts/                     # check-meta.mts
public/images/               # Portrait + blog/ covers and inline images
.altalogy/                   # Our working record
```

Import via `@/`. Never `../` across top-level folders.

```text
page → MainLayout → sections → Section → container → content
```

## Adding a blog post

1. Add the body as `content/blog/<slug>.mdx` (plain Markdown; images via
   `<Figure src="/images/blog/…" width={…} height={…} alt="…" />`).
2. Add an entry to `posts` in `content/blog/posts.ts` (keep newest first). `excerpt` is the
   card copy; `description` must be 50–160 chars for the meta audit.
3. Put the cover in `public/images/blog/<slug>.jpg` (≤1600px wide).

Titles over 60 chars are trimmed for `<title>` by `seoTitle()`; the on-page title is untouched.

## Design direction

> A faithful copy of the existing Webflow site (built on the Writeology template): white,
> airy, editorial blog layout; Manrope throughout; near-black headings over grey body copy;
> a single cyan accent reserved for the CTA pill; grey category tags; image cards with a dark
> gradient for featured posts. Deliberately _not_ redesigned — match angleo.pl when unsure.

**This is the reference for any judgement call.** Compare against angleo.pl before guessing.

- **Figma:** — (none; the live Webflow site is the reference)

## Design system

Tokens in `app/styles/tokens.css` (values measured from the Webflow CSS). **Extend the tokens
before reaching for an arbitrary value.**

| Token                 | Tailwind                 | Usage                                   |
| --------------------- | ------------------------ | --------------------------------------- |
| `--background`        | `bg-background`          | Page background (#fff)                  |
| `--foreground`        | `text-foreground`        | Headings, strong text (#131313)         |
| `--foreground-muted`  | `text-foreground-muted`  | Body copy (#727272)                     |
| `--surface`           | `bg-surface`             | Post hero band, tags (#f0f0f0)          |
| `--border`            | `border-border`          | Dividers                                |
| `--accent`            | `bg-accent`              | CTA pill only (#02d1ff)                 |
| `--accent-foreground` | `text-accent-foreground` | Text on accent                          |
| `--text-display-1`    | `text-display-1`         | Post / page h1 (48/63)                  |
| `--text-display-4`    | `text-display-4`         | Card titles, rich-text h2 (28/40)       |
| `--text-heading`      | `text-heading`           | h3 (24/34)                              |
| `--text-subheading`   | `text-subheading`        | Rich-text h3 (22/32)                    |
| `--text-logo`         | `text-logo`              | Header wordmark (36px)                  |
| `--tracking-label`    | `tracking-label`         | Nav, buttons, uppercase labels (0.08em) |

- **Typography:** Manrope via `next/font` (`font-sans`). `Text` and `Heading` from
  `components/text/`. One `h1` per page (visually hidden on `/` and `/o-mnie`, as on Webflow).
- **Spacing:** layout utilities (`px-container`, `py-section`, `max-w-content` = 1175px,
  `max-w-prose-narrow` = 740px), not raw values, unless no token exists.
- **Dates** use the English format the Webflow site shows ("July 27, 2025") — `formatDate()`.

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

| Route                          | Sections                                  | Notes                                             |
| ------------------------------ | ----------------------------------------- | ------------------------------------------------- |
| `/`                            | HomeHero, CategoryBar, PostFeed + Sidebar | Featured picks: `featuredSlugs` in `posts.ts`     |
| `/blog/[slug]`                 | PostHero, MDX body, Sidebar (left)        | Unknown slug → `notFound()` (200 + noindex, PPR)  |
| `/blog-post-categories/[slug]` | CategoryHero, PostFeed + Sidebar          | Old Webflow URL scheme kept, incl. `logistyka-2`  |
| `/o-mnie`                      | Portrait, ContactDetails, `about.mdx`     |                                                   |
| `/umow-lekcje`                 | Kontakt + Terminarz                       | Booking = Google Apps Script calendar (`site.ts`) |

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
