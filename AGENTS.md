<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Angleo

Website + blog of Nicole Kurek — business English trainer, Polish-language audience. Content
and URLs migrated from the Webflow site at angleo.pl; redesigned as a premium editorial site.

## Stack

- Next.js 16.4.2 (App Router, `cacheComponents` on), React 19.3.0
- Tailwind 4 — `@import 'tailwindcss'` in `app/globals.css`; tokens in
  `app/styles/tokens.css`. **No `tailwind.config.*`.**
- TypeScript (strict), ESLint + Prettier
- Content: MDX in repo (`@next/mdx`) — post bodies in `content/blog/*.mdx`, post metadata
  in `content/blog/posts.ts`, site copy in `content/site.ts`
- Booking: custom UI on Cal.com API v2 (`lib/cal.ts`, server only) — see "Booking" below
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
app/                           # Routes + root layout (html/body/fonts)
  page.tsx                     # / — landing: hero, credentials, offer, topics, blog, quote, CTA
  blog/page.tsx                # /blog — featured + all posts, category chips
  blog/[slug]/                 # /blog/<slug> — article
  blog-post-categories/[slug]/ # category listing (old Webflow URL kept)
  o-mnie/ · umow-lekcje/       # about · booking (custom Cal.com calendar)
  api/booking/                 # POST create booking · slots/ GET availability
  styles/                      # tokens.css, utilities/layout.css
components/
  ui/                          # Section, Container, Button, Icon
  text/                        # Heading, Text, Eyebrow, Accent (*word* → italic accent)
  blog/                        # PostCard/PostGrid, FeaturedPost, PostMeta, CategoryChips
  marketing/                   # SectionHeader, BookingCta, ContactList
  booking/                     # BookingWidget ('use client'): MonthCalendar, TimeSlots, BookingForm, BookingSuccess
sections/                      # Route-specific blocks: home/, blog/, about/, contact/
layouts/                       # MainLayout, Header, MobileMenu ('use client'), Footer
content/
  site.ts                      # All page copy, contact details
  blog/posts.ts                # Post metadata (newest first) + featuredSlug
  blog/categories.ts           # Categories (order = chips, topics, footer)
  blog/<slug>.mdx              # Post bodies
mdx-components.tsx             # Article typography + <Figure>
lib/
  blog.ts                      # Post/category helpers, formatDate (pl-PL), plural(), seoTitle()
  booking.ts                   # zod schemas + shared booking types
  cal.ts                       # Cal.com API v2 client ('server-only')
  rate-limit.ts                # Per-instance limiter for the booking routes
  metadata.ts                  # buildMetadata()
  meta-audit/                  # Meta & OG audit module
scripts/                       # check-meta.mts
public/images/                 # Portrait + blog/ covers and inline images
.altalogy/                     # Our working record
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

## Booking (Cal.com)

Custom booking flow on `/umow-lekcje#rezerwacja`; Cal.com is only the backend (availability,
calendar sync, Google Meet link, confirmation/reschedule emails).

```text
BookingWidget (client) → GET /api/booking/slots → lib/cal.ts → Cal.com GET /v2/slots
                       → POST /api/booking      → lib/cal.ts → Cal.com POST /v2/bookings
```

- **Env:** `CAL_API_KEY` (server only — never `NEXT_PUBLIC_`), `CAL_EVENT_TYPE_ID`.
- **API versions:** slots `2024-09-04`, bookings `2026-02-25`, event types `2024-06-14`
  (`cal-api-version` header; wrong value silently falls back to an older contract).
- **Plan:** hosted API v2 needs a paid Cal.com plan (Teams+); the free plan has no API access.
- **Spam:** honeypot field `website`, 3 s timing trap (`renderedAt`), rate limit 5 bookings /
  10 min / IP and 60 slot queries / min / IP (per instance — best effort on serverless).
- **Time zones:** the widget uses the visitor's browser time zone; Cal returns slots grouped
  by local date in that zone. Date math in `components/booking/dates.ts` is UTC-only.
- `getLessonInfo()` (duration, online) is `'use cache'` with `cacheLife('hours')`.

## Design direction

> Premium, editorial business-English brand. Warm ivory paper, deep ink-navy type, one brass
> accent used sparingly (eyebrows, italic accent words, numerals, list markers). Large
> Instrument Serif display headlines with an italic accent word; Geist for everything else.
> Generous whitespace, hairline borders, soft rounded imagery, an ink CTA band closing each
> page. Motion is limited to hover feedback — no scroll animations, no carousels.
> Deliberately _not_ a playful language-school look, not corporate-blue, not loud gradients.

**This is the reference for any judgement call.** Check against it before guessing.

- **Figma:** — (none; designed in code. Previous Webflow look is in git history, `6dbf2f3`.)

## Design system

Tokens in `app/styles/tokens.css`. **Extend the tokens before reaching for an arbitrary
value.**

| Token                  | Tailwind                            | Usage                                      |
| ---------------------- | ----------------------------------- | ------------------------------------------ |
| `--background`         | `bg-background`                     | Ivory page (#f7f4ee); text on ink          |
| `--surface`            | `bg-surface`                        | White cards                                |
| `--surface-muted`      | `bg-surface-muted`                  | Alternate bands, author box                |
| `--foreground`         | `text-foreground` / `bg-foreground` | Ink navy (#0e1726): type, CTA band, footer |
| `--foreground-muted`   | `text-foreground-muted`             | Secondary copy                             |
| `--border`             | `border-border`                     | Hairlines                                  |
| `--accent`             | `text-accent`                       | Brass on ivory (#8c6a35, AA)               |
| `--accent-light`       | `text-accent-light`                 | Brass on ink                               |
| `--inverse-muted`      | `text-inverse-muted`                | Secondary text on ink                      |
| `--text-display-*`     | `text-display-xl/lg/md/sm`          | Serif headlines (80/60/44/34px)            |
| `--text-title`         | `text-title`                        | Card titles (26px serif)                   |
| `--text-lead`/`-prose` | `text-lead` / `text-prose`          | Intro copy (19px) / article body (18px)    |
| `--tracking-display`   | `tracking-display`                  | Serif headlines (-0.02em)                  |
| `--tracking-eyebrow`   | `tracking-eyebrow`                  | Uppercase labels (0.16em)                  |
| `--radius-arch`        | `rounded-t-arch`                    | Arched portrait top                        |
| `--shadow-card`        | `shadow-card`                       | Featured card, floating badge              |
| `--ease-out-soft`      | `ease-out-soft`                     | Hover transforms                           |

- **Typography:** `Heading` (serif; `size` xl/lg/md/sm; `<em>` → brass italic),
  `Text` (lead/body), `Eyebrow`. Copy strings in `content/site.ts` mark the accent word
  with `*asterisks*`, rendered by `<Accent text=… />`. One `h1` per page.
- **Spacing:** `px-container`, `py-section` / `pt-section` / `pb-section`, `max-w-content`
  (1232px), `max-w-reading` (680px article column).
- **Buttons:** `Button` variants `primary` (ink), `secondary` (outline), `light` (on ink);
  `arrow` adds the animated arrow. Height 48px (44px+ tap target).
- **Dates:** Polish long format via `formatDate()` ("27 lipca 2025"); counts via `articles()`.

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

| Route                          | Sections                                                         | Notes                                            |
| ------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------ |
| `/`                            | Hero, Credentials, Offer, Topics, LatestPosts, Quote, BookingCta | `#tematy` anchor; featured = `featuredSlug`      |
| `/blog`                        | BlogHeader + CategoryChips, FeaturedPost, PostGrid               |                                                  |
| `/blog/[slug]`                 | ArticleHeader, MDX body, AuthorBox, RelatedPosts, BookingCta     | Unknown slug → `notFound()` (200 + noindex, PPR) |
| `/blog-post-categories/[slug]` | BlogHeader (active chip), PostGrid                               | Old Webflow URL scheme kept, incl. `logistyka-2` |
| `/o-mnie`                      | AboutHero, AboutDetails, Quote, BookingCta                       |                                                  |
| `/umow-lekcje`                 | Header, ContactCards                                             | Booking = Google Apps Script calendar            |

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
