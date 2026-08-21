# Repository Guidelines

## Project Structure & Module Organization

This repository is a Hugo portfolio. Put page content in `content/`, site and
public profile settings in `config/_default/`, and Go HTML templates in
`layouts/`; reusable templates belong in `layouts/partials/`. Hugo processes
CSS and images from `assets/`, while files in `static/` are copied unchanged.
Browser, accessibility, and integrity tests live in `e2e/`; the Lighthouse
runner is in `scripts/`. Do not hand-edit generated `public/`, `resources/`,
`e2e-results/`, `playwright-report/`, or `.lighthouseci/` content.

## Build, Test, and Development Commands

Use the versions pinned in `.mise.toml` (Hugo 0.165.0, Node 24.19.0, and pnpm
11.22.0). Run `mise trust`, `mise install`, `pnpm install`, and
`pnpm exec playwright install chromium` for initial setup.

- `pnpm dev` serves the site at `http://127.0.0.1:1313/`.
- `pnpm build` creates a strict, minified production build in `public/`.
- `pnpm test` runs Playwright on desktop Chrome and a Pixel 5 profile.
- `pnpm lighthouse` checks the locally built production site.
- `pnpm format:check` and `pnpm lint` run Oxc validation.
- `pnpm check` runs formatting, linting, build, tests, and Lighthouse.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF endings, final newlines, spaces, and two-space
indentation. Oxfmt uses an 80-column target; run `pnpm format` before committing.
Oxlint treats correctness, suspicious, and performance findings as errors. Use
kebab-case filenames for Hugo partials and CSS, BEM-style CSS classes such as
`intro-section__person-name`, and `*.spec.ts` for tests. Follow existing template
formatting because Oxfmt excludes HTML.

## Testing Guidelines

Write behavior-focused Playwright cases under `e2e/`; Playwright starts Hugo
automatically. Use `pnpm test:ui`, `pnpm test:headed`, or `pnpm test:debug` while
developing. Accessibility changes must preserve zero Axe WCAG 2.2 AA and best-
practice violations. Lighthouse minimums are 90 performance, 100 accessibility,
95 best practices, and 100 SEO. There is no numeric code-coverage requirement.

## Commit & Pull Request Guidelines

Prefer concise Conventional Commit subjects: `feat: add ...`, `fix: correct ...`,
or scoped forms such as `test(e2e): cover ...`; use lowercase, action-oriented
text without a trailing period. Complete the PR template's **Summary** and
**Changes** sections, mention validation performed, link relevant issues, and
include before/after screenshots for visible changes. Ensure `pnpm check` passes
before requesting review.

## Security & Configuration

Never commit `.env` files, private keys, or credentials. Treat changes to
`config/_default/params.toml` as public because it contains deployed identity,
contact, and external-link data. Keep `pnpm-lock.yaml` synchronized with
dependency changes.
