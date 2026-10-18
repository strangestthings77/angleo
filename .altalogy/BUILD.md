# BUILD

The plan for this project and the reasoning behind it — sitemap, components, design
decisions, and the trade-offs we accepted. Filled during the planning step.

## Sitemap

- `/` — single page: Hero → O mnie (+ Czego się nauczysz) → Tematy → Kontakt

## Decisions

- Content copied from the existing Webflow site (angleo.pl): home, `/o-mnie`, `/umow-lekcje`.
  Webflow template pages (sign-in, premium, styleguide) are not carried over.
- Copy lives in `content/site.ts` (typed) rather than MDX — one page, no prose bodies yet.
  Move to MDX if the blog is migrated.
- "Umów lekcję" links to the existing Google Apps Script booking calendar.
- Portrait downloaded from the Webflow CDN into `public/images/` (resized to 1200px).
