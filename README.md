# Angleo

Website and blog of Nicole Kurek, English trainer — business English for Polish
professionals. Migrated from the Webflow site angleo.pl (same content and URLs) and
redesigned; built with Next.js, Tailwind CSS 4, TypeScript and MDX blog posts.

- **Production:** {url} · **Preview:** {url} · **Figma:** — · **CMS:** —
- **Test branch:** `test-env` — for trying out deploys before they reach `main`

## Requirements

Node 20.9.0 (`.nvmrc`) · pnpm 10.33.0 (`packageManager` in `package.json`)

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Environment variables

| Variable               | Required | What it is                                                                                   |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | yes      | Public origin, used for canonical and OG URLs                                                |
| `SITE_URL`             | yes      | Origin used by `next-sitemap` for `sitemap.xml`/`robots.txt`                                 |
| `CAL_API_KEY`          | yes      | Cal.com API v2 key (Settings → Developer → API keys). Server only. Needs a paid Cal.com plan |
| `CAL_EVENT_TYPE_ID`    | yes      | Id of the lesson event type in Cal.com                                                       |

## Commands

`pnpm dev` · `pnpm build` · `pnpm check` · `pnpm check:meta` · `pnpm db:link` · `pnpm db:push`

## Deployment

Vercel builds `main`; PRs get a preview. Build: `pnpm build`. Output: `.next`.

## Database

Schema lives in `supabase/migrations/`. One-time setup per machine:

```bash
pnpm exec supabase login
pnpm db:link
```

Then apply migrations with `pnpm db:push`. Load the English→Polish dictionary (once, or to
refresh it) with `pnpm dict:import` — data from Polish Wiktionary, CC BY-SA 4.0.

## Content

- **Blog posts:** body in `content/blog/<slug>.mdx`, metadata (title, date, category,
  excerpt, cover) in `content/blog/posts.ts`. See "Adding a blog post" in `AGENTS.md`.
- **Booking:** availability, lesson length and the Google Meet location are managed in
  Cal.com (event type `CAL_EVENT_TYPE_ID`); the site only renders and submits.
- **All page copy** (home, about, contact, CTA band, footer) and contact details:
  `content/site.ts`. Wrap a word in `*asterisks*` in a heading to give it the italic accent.

## Outstanding

- [ ] Connect Vercel and set `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `CAL_API_KEY`, `CAL_EVENT_TYPE_ID`; point angleo.pl at it
- [ ] Move booking to Nicole's own Cal.com account + event type (currently a test event)
- [ ] Client review of the new headline copy (listed in `.altalogy/BUILD.md`)
- [ ] Designed OG image to replace `public/og.svg` (posts already use their cover)
- [ ] Instagram / Facebook profile URLs (the Webflow site links to generic placeholders)
- [ ] Unknown `/blog/<slug>` returns the 404 page with status 200 (PPR streaming) — add a
      proxy check if a hard 404 matters

## Docs

`AGENTS.md` — conventions and design system · `.altalogy/BUILD.md` — the plan
