# Repository Guidelines

## Project Structure & Module Organization

This repository is a Hugo portfolio. Put page content in `content/`, site and
public profile settings in `config/_default/`, and Hugo HTML templates in
`layouts/`; reusable templates belong in `layouts/_partials/`. Hugo processes
CSS and images from `assets/`, while files in `static/` are copied unchanged.
Browser, accessibility, and integrity tests live in `e2e/`; the Lighthouse
runner is in `scripts/`. Do not hand-edit generated `public/`, `resources/`,
`e2e-results/`, `playwright-report/`, or `.lighthouseci/` content.

## Build, Test, and Development Commands

Use the versions pinned in `.mise.toml` (Hugo 0.165.0, Node 24.19.0, and pnpm
11.22.0). Run `mise trust`, `mise install`, `pnpm install`, and
`pnpm exec playwright install chromium webkit` for initial setup.

- `pnpm dev` serves the site at `http://127.0.0.1:1313/`.
- `pnpm build` creates a strict, minified production build in `public/`.
- `pnpm test` runs Playwright on desktop Chrome and a Pixel 5 profile.
- `pnpm lighthouse` starts and audits a local production Hugo server.
- `pnpm format:check` and `pnpm lint` run Oxc validation.
- `pnpm commitlint --last` validates the latest commit message.
- `pnpm check` runs formatting, linting, build, tests, and Lighthouse.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF endings, final newlines, spaces, and two-space
indentation. Oxfmt uses an 80-column target; run `pnpm format` before committing.
Oxlint treats correctness, suspicious, and performance findings as errors. Use
kebab-case filenames for Hugo partials and CSS, BEM-style CSS classes such as
`system-entry__title`, and `*.spec.ts` for tests. Follow existing template
formatting because Oxfmt excludes HTML. Regenerate the hosted CV with
`pnpm cv:build`, PNG site icons with `pnpm site-icons:build`, and the social
preview with `pnpm social-image:build`; do not hand-edit the generated PDF or
PNG outputs.

In public facing prose and portfolio copy, do not use em dashes or hyphens
between words. Rewrite with plain words or punctuation instead. This prose rule
does not change required code syntax or filename conventions.

Apply YAGNI and prefer simple, direct coding patterns. Add abstractions,
dependencies, or runtime behavior only when a demonstrated requirement
justifies them. Favor clear, maintainable solutions that reflect professional
senior engineering judgment.

## Testing Guidelines

Write behavior-focused Playwright cases under `e2e/`; Playwright starts Hugo
automatically. Use `pnpm test:ui`, `pnpm test:headed`, or `pnpm test:debug` while
developing. Accessibility changes must preserve zero Axe WCAG 2.2 AA and best-
practice violations. Lighthouse minimums are 100 performance, 100
accessibility, 100 best practices, and 100 SEO. There is no numeric
code-coverage requirement.

## Commit & Pull Request Guidelines

Use concise Conventional Commit subjects: `feat: add ...`, `fix: correct ...`,
or scoped forms such as `test(e2e): cover ...`; use lowercase, action oriented
text without a trailing period. Lefthook validates commit messages locally, and
CI validates every new pull request commit, the pull request title, and commits
pushed directly to `main`. Complete the PR template's **Summary**, **Changes**,
and **Validation** sections, link relevant issues, and include before and after
screenshots for visible changes. Ensure `pnpm check` passes before requesting
review.

After each successful production audit, release automation evaluates the
Conventional Commits. Breaking changes create major versions, `feat` creates
minor versions, and `fix` or `perf` creates patch versions. Other commit types
are recorded in Git and deployment history but do not create a version by
themselves.

## Security & Configuration

Never commit `.env` files, private keys, or credentials. Treat changes to
`config/_default/params.toml` as public because it contains deployed identity,
contact, and external-link data. Keep `pnpm-lock.yaml` synchronized with
dependency changes.
