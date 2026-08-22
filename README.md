# Vladan Petrovic Portfolio

[![CI and Deployment](https://github.com/vladanp/vladan-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/vladanp/vladan-portfolio/actions/workflows/ci.yml)
[![Production Audit](https://github.com/vladanp/vladan-portfolio/actions/workflows/audit.yml/badge.svg)](https://github.com/vladanp/vladan-portfolio/actions/workflows/audit.yml)

Source for [vladan.dev](https://vladan.dev/), the portfolio of Vladan
Petrovic, a Senior Software Engineer. It is a lightweight Hugo site with no
JavaScript sent to the browser and no external runtime dependencies.

## Technology

The site is built with Hugo. Node.js tooling handles committed asset generation
and repository validation. Playwright, Axe, and Lighthouse cover browser
behavior, accessibility, and performance; Oxfmt and Oxlint provide formatting
and linting.

The supported toolchain is defined in `.mise.toml`, `package.json`, and the
pnpm lockfile. With [mise](https://mise.jdx.dev/) installed:

```bash
mise trust
mise install
pnpm install
pnpm exec playwright install chromium webkit
```

## Local development

```bash
pnpm dev
```

The site is available at <http://127.0.0.1:1313/>. Alternatively, run
`docker compose up`; the container exposes the site at the same address,
restricts host access to the loopback interface, and mounts only the Hugo
source directories.

## Build and validation

```bash
pnpm build               # strict, minified production build in public/
pnpm test                # Chromium and WebKit desktop and mobile, integrity, and Axe tests
pnpm lighthouse          # local Lighthouse audit against a production server
pnpm format:check        # formatting validation
pnpm lint                # JavaScript and TypeScript linting
pnpm commitlint --last   # validate the latest commit message
pnpm check               # format, lint, build, browser tests, and Lighthouse
pnpm cv:build            # regenerate the hosted CV PDF
pnpm site-icons:build    # regenerate browser and install icons
pnpm social-image:build  # regenerate the social preview image
```

`pnpm lighthouse:production` audits the deployed site and requires network
access. Git hooks run formatting, linting, and Conventional Commit checks.
Install them by running `pnpm install` or `pnpm prepare`.

## Repository structure

- `config/_default/`: Hugo site settings and factual portfolio data
- `content/`: visible Markdown content
- `layouts/`: base template, page layouts, partials, and `robots.txt`
- `assets/`: CSS and fingerprinted brand and social images processed by Hugo
- `static/`: the custom domain, web manifest, install icons, and hosted CV
- `e2e/`: Playwright and Axe validation of generated pages and endpoints
- `scripts/`: Lighthouse validation and source templates for generated assets
- `.github/workflows/`: validation, deployment, and production auditing

Public identity, contact details, current role data, and external links live in
`config/_default/params.toml`. Homepage copy and selected work live in
`content/_index.md`. The editable CV, site icon, and social image sources are in
`scripts/`; their generated files are committed so production builds stay
static and do not require a browser. When professional details change, update
the public configuration, homepage content, CV source, social image source, and
web manifest as applicable, then regenerate the affected assets.

## CI and deployment

Pull requests to `main` run CodeQL static analysis, formatting, linting,
dependency audit, a strict production Hugo build, parallel Playwright/Axe tests
across Chromium and WebKit, endpoint and resource integrity checks, and perfect
Lighthouse thresholds across performance, accessibility, best practices, and
SEO. Pushes to `main` run the same validation, then deploy that exact validated
artifact to the GitHub Pages deployment branch.

After deployment, a separate workflow waits until the matching commit revision
is live at `vladan.dev` and runs a production Lighthouse audit with three
samples. The deployment job also records the source commit and public URL in
GitHub's `production` environment.

Every pull request commit and title must follow Conventional Commits. CI also
validates commits pushed directly to `main` before allowing deployment. After a
production revision passes the live audit, Semantic Release analyzes the
commits since the previous version and creates a `vX.Y.Z` tag and GitHub
Release. Breaking changes create major versions, `feat` creates minor versions,
and `fix` or `perf` creates patch versions. Repository documentation, tests,
tooling, and CI changes remain visible in Git and deployment history but do not
create a release by themselves. This repository does not publish an npm package,
and release automation does not commit generated version files.

GitHub Releases provide durable version notes. GitHub deployment history, the
workflow run, and the live `build-revision` metadata remain the source of truth
for the exact commit currently shipped. Renovate keeps dependencies and
SHA pinned GitHub Actions current, waiting seven days after release before
proposing updates.

## License

Licensed under the [MIT License](./LICENSE).
