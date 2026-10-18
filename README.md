# Angleo

Website and blog of Nicole Kurek, English trainer — business English for Polish
professionals. A Next.js rebuild of the Webflow site angleo.pl (same design and URLs), with
Tailwind CSS 4, TypeScript and MDX blog posts.

- **Production:** {url} · **Preview:** {url} · **Figma:** — · **CMS:** —

## Requirements

Node 20.9.0 (`.nvmrc`) · pnpm 10.33.0 (`packageManager` in `package.json`)

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Environment variables

| Variable               | Required | What it is                                                   |
| ---------------------- | -------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | yes      | Public origin, used for canonical and OG URLs                |
| `SITE_URL`             | yes      | Origin used by `next-sitemap` for `sitemap.xml`/`robots.txt` |

## Commands

`pnpm dev` · `pnpm build` · `pnpm check` · `pnpm check:meta`

## Deployment

Vercel builds `main`; PRs get a preview. Build: `pnpm build`. Output: `.next`.

## Content

- **Blog posts:** body in `content/blog/<slug>.mdx`, metadata (title, date, category,
  excerpt, cover) in `content/blog/posts.ts`. See "Adding a blog post" in `AGENTS.md`.
- **About page:** `content/about.mdx`.
- **Contact details, booking link, footer:** `content/site.ts`.

## Outstanding

- [ ] Connect Vercel and set `NEXT_PUBLIC_SITE_URL` / `SITE_URL`; point angleo.pl at it
- [ ] Confirm the Writeology template licence allows reusing its look outside Webflow
- [ ] Designed OG image to replace `public/og.svg` (posts already use their cover)
- [ ] Instagram / Facebook profile URLs (the Webflow site links to generic placeholders)
- [ ] Unknown `/blog/<slug>` returns the 404 page with status 200 (PPR streaming) — add a
      proxy check if a hard 404 matters

## Docs

`AGENTS.md` — conventions and design system · `.altalogy/BUILD.md` — the plan
