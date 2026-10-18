# Angleo

Personal website of Nicole Kurek, English trainer — business English for Polish
professionals. Built with Next.js, Tailwind CSS 4 and TypeScript.

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

All copy lives in `content/site.ts`. Edit the strings there and redeploy.

## Outstanding

- [ ] Connect Vercel and set `NEXT_PUBLIC_SITE_URL` / `SITE_URL`
- [ ] Blog posts from angleo.pl not migrated yet
- [ ] Design (Figma) — current look is a placeholder direction
- [ ] Designed OG image to replace `public/og.svg`
- [ ] Instagram / Facebook profile URLs (the Webflow site links to generic placeholders)

## Docs

`AGENTS.md` — conventions and design system · `.altalogy/BUILD.md` — the plan
