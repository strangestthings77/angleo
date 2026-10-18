## Gate 1 — Ready for Dev

### Internal — our side

- [x] Base tech stack chosen — framework, CMS, hosting. Recorded in `stack.md`.
- [ ] Figma: first views are dev-ready — final enough to build, not still moving.
- [ ] Figma: design system defined — type scale, colour tokens, spacing as reusable styles.
- [ ] Figma: design direction written down — the concept, the mood, the leading accent,
      what the design deliberately is _not_. Copied into `AGENTS.md`.
- [ ] Figma: per-screen intent described — layout reasoning, responsive behaviour, states.
- [x] Fonts available and licensed, in the weights the design uses. (Inter + Fraunces, OFL)

### External — the client's side

- [ ] Tech stack confirmed with the client, including cost implications.
- [x] CMS content provided, or scoped with a deliverable and deadline. (copied from angleo.pl)
- [ ] Cookies / tracking stance decided.

## Gate 2 — Client Hand-off

- [ ] `pnpm check` and `pnpm build` green on `main`; CI green on GitHub.
- [ ] `pnpm check:meta` reports zero errors against production.
- [ ] Production URL live on angleo.pl; preview deploys work on PRs.
- [ ] README complete — a developer can clone, run, and deploy from it alone.
- [ ] Designed OG image in place of `public/og.svg`.
- [ ] `pnpm dlx knip` run, unused code removed.
