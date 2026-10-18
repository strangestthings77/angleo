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
- Auth + DB: Supabase (`@supabase/ssr`), student area under `/panel`, admin under `/admin`
- Hosting: Vercel

## Commands

```bash
pnpm dev            # dev server
pnpm build          # production build — run before claiming things compile
pnpm check          # format:check + lint + typecheck — the gate
pnpm test           # vitest (lib/*.test.ts)
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
  marketing/                   # InkPanel, PageHero, SectionHeader, BookingCta, ContactList
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
- **Booking window:** today + 13 days (`BOOKING_WINDOW_DAYS = 14` in `lib/booking.ts`). The
  widget fetches the whole window once; the slots route clamps any range to it and the booking
  route rejects starts beyond it. Mirror it in Cal.com (event type → Limits → limit future
  bookings) so reschedule links from Cal emails respect it too.
- **API versions:** slots `2024-09-04`, bookings `2026-02-25`, event types `2024-06-14`
  (`cal-api-version` header; wrong value silently falls back to an older contract).
- **Plan:** hosted API v2 needs a paid Cal.com plan (Teams+); the free plan has no API access.
- **Signed-in booking:** `/umow-lekcje` reads the session (`getViewer()`, inside Suspense). Signed-in
  users don't see name/email fields; `/api/booking` takes both from the account and ignores
  client values. The timing trap applies to anonymous visitors only.
- **Next lesson:** `/panel` shows `NextLessonCard` only when Cal.com has ≥1 upcoming booking for
  the student's email (`getUpcomingLessons()`, `GET /v2/bookings`, version `2026-05-01`) —
  live, so reschedules/cancellations made from Cal emails are reflected.
- **Spam:** honeypot field `website`, 3 s timing trap (`renderedAt`), rate limit 5 bookings /
  10 min / IP and 60 slot queries / min / IP (per instance — best effort on serverless).
- **Time zones:** the widget uses the visitor's browser time zone; Cal returns slots grouped
  by local date in that zone. Date math in `components/booking/dates.ts` is UTC-only.
- `getLessonInfo()` (duration, online) is `'use cache'` with `cacheLife('hours')`.

## Auth & student area (Supabase)

```text
proxy.ts → lib/supabase/proxy.ts   refreshes the session cookie; /panel, /admin → /logowanie if signed out
                                   (never redirects away from /logowanie — that caused a reload loop)
lib/supabase/server.ts             server client (Server Components, Actions, Route Handlers)
lib/auth.ts                        DAL: getCurrentUser, requireUser, requireAdmin, getMyWords, getStudents
lib/auth-actions.ts                Server Actions: signIn, signUp, signOut
app/auth/callback/route.ts         email-link landing (PKCE code or token_hash) → session
supabase/migrations/               schema as code — profiles (role), is_admin(), words + RLS
```

- **Routes:** `/logowanie`, `/rejestracja`, `/panel` (student: exercises placeholder + words),
  `/admin` (admin: all students). All `noindex` and excluded from the sitemap.
- **Roles:** every sign-up gets a `profiles` row with `role = 'student'` (trigger). Promote an
  admin from the terminal (uses the CLI login, no DB password):
  `pnpm exec supabase db query --linked "update public.profiles set role = 'admin' where email = '…';"`
  — or run the same `update` in the Supabase SQL editor. Current admin: Nicole Kurek.
  There are no update policies, so users can never change their own role.
- **Lessons & levels:** `profiles.lessons_completed` (0–1000). Level = ⌊lessons / 10⌋ + 1 —
  the rule lives only in `lib/progress.ts`. Students see `ProgressCard` on `/panel`; admins edit
  per student on `/admin` (`LessonsEditor` → `setStudentLessons` action → DB function
  `set_student_lessons()`, which re-checks `is_admin()` and touches only that column).
- **Words:** added by the admin per student (`words.student_id`); the starter set was removed
  (migration `20261018170000`). `student_id = null` would still show to every student. `WordCard` shows the
  English side only; the Polish translation appears on hover (pointer) or tap/Enter (touch, keyboard).
- **Panel tabs:** Ćwiczenia (placeholder) · Słówka (flip cards) · Test słówek (`WordQuiz`).
  `components/ui/Tabs.tsx` is the accessible tabs primitive (arrow keys, `#hash` deep link).
- **Word test answers** (`lib/answer-check.ts`, tested in `answer-check.test.ts`): case, spacing,
  punctuation and Polish diacritics are ignored; `a / b` = alternatives; `(…)` = optional part;
  small typos → "Prawie dobrze" (none for ≤4 letters). On a miss the student can overrule
  ("Miałem(-am) rację") — self-study, so honesty-based. Results aren't stored yet.
- **Session checks:** proxy and `getCurrentUser()` both use `auth.getClaims()` so they agree.
  A failed profile read throws (→ `app/panel/error.tsx`), it never redirects.
- **One browser = one account.** The session is one cookie per site; to test admin and student
  side by side, use a second browser or a private window.
- **RLS is the security boundary.** The publishable key is public; every table has RLS on.
  Admin reads go through `public.is_admin()` (security definer — avoids recursive policies).
- **Cache Components:** anything reading the session lives inside `<Suspense>` (see
  `app/panel/page.tsx`); never call `getCurrentUser()` at a layout's top level.
- **Schema changes:** add a migration in `supabase/migrations/`, then `pnpm db:push`
  (needs `pnpm exec supabase login` + `pnpm db:link` once per machine).
- **Env:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- **Email:** Supabase's built-in mailer is rate-limited (testing only). Set custom SMTP in
  Supabase → Auth → SMTP before real students sign up.

## Design direction

> Premium, editorial business-English brand. Warm ivory paper, deep ink-navy type, one brass
> accent used sparingly (eyebrows, italic accent words, numerals, list markers). Large
> Instrument Serif display headlines with an italic accent word; Geist for everything else.
> Heroes are light (ivory, hairline bottom border, brass-outlined portrait) — a dark hero was
> tried and rejected. Ink with film grain (`InkPanel`) is reserved for accents: the offer
> lead card and the CTA band that closes each page. Content sits on ivory with hairline
> borders, bento cards and soft rounded imagery. Motion is calm and CSS-only (see Motion).
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
| `bg-grain` (utility)   | `bg-grain`                          | Inline SVG noise on ink panels (InkPanel)  |

- **Typography:** `Heading` (serif; `size` xl/lg/md/sm; `<em>` → brass italic),
  `Text` (lead/body), `Eyebrow`. Copy strings in `content/site.ts` mark the accent word
  with `*asterisks*`, rendered by `<Accent text=… />`. One `h1` per page.
- **Spacing:** `px-container`, `py-section` / `pt-section` / `pb-section`, `max-w-content`
  (1232px), `max-w-reading` (680px article column).
- **Buttons:** `Button` variants `primary` (ink), `secondary` (outline), `light` (on ink);
  `arrow` adds the animated arrow. Height 48px (44px+ tap target).
- **Dates:** Polish long format via `formatDate()` ("27 lipca 2025"); counts via `articles()`.

## Motion

All in `app/styles/motion.css` — no animation library. Every effect is disabled under
`prefers-reduced-motion`.

| Utility / API                     | What it does                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| `animate-rise` + `rise-step-N`    | Hero entrance: fade + 14px rise + blur, staggered N × 90ms                                    |
| `animate-portrait`, `animate-pop` | Portrait settle (scale .96→1), floating cards/bubbles pop                                     |
| `reveal`                          | Scroll-driven entrance (`animation-timeline: view()`); unsupported browsers just show content |
| `header-scrolled`                 | Header gains shadow over the first 120px of scroll (`scroll(root)`)                           |
| `details-animate`                 | `<details>` open/close via `::details-content` + `interpolate-size`                           |
| `animate-fade`                    | 280ms fade for UI state swaps (booking steps, times, menu icon)                               |
| `<ViewTransition>`                | In `MainLayout`: route-change crossfade (`.page` class); header anchored via `vt-header`      |

Rules: animate only transform/opacity (accordion height is the one exception); hovers use
Tailwind `hover:` (pointer devices only); buttons press to `scale-97`; no marquees/carousels.

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
