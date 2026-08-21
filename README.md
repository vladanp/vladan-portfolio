# Vladan Petrovic Portfolio

[![CI and Deployment](https://github.com/vladanp/vladan-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/vladanp/vladan-portfolio/actions/workflows/ci.yml)
[![Production Audit](https://github.com/vladanp/vladan-portfolio/actions/workflows/audit.yml/badge.svg)](https://github.com/vladanp/vladan-portfolio/actions/workflows/audit.yml)

Source for [vladan.dev](https://vladan.dev/), the portfolio of Vladan
Petrovic, a Senior Software Engineer. It is a lightweight Hugo site with no
JavaScript sent to the browser and no external runtime dependencies.

## Technology

The site is built with Hugo and uses Node.js tooling only for repository
validation. Playwright, Axe, and Lighthouse cover browser behavior,
accessibility, and performance; oxfmt and oxlint provide formatting and
linting.

The supported toolchain is defined in `.mise.toml`, `package.json`, and the
pnpm lockfile. With [mise](https://mise.jdx.dev/) installed:

```bash
mise trust
mise install
pnpm install
pnpm exec playwright install chromium
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
pnpm test                # desktop and mobile browser, integrity, and Axe tests
pnpm lighthouse          # local Lighthouse audit against a production server
pnpm format:check        # formatting validation
pnpm lint                # JavaScript and TypeScript linting
pnpm check               # all of the checks above
```

`pnpm lighthouse:production` audits the deployed site and requires network
access. A Git hook runs the formatting and lint checks. Install it by running
`pnpm install` or `pnpm prepare`.

## Repository structure

- `config/_default/`: Hugo site settings and factual portfolio data
- `content/`: visible Markdown content
- `layouts/`: base template, page layouts, partials, and `robots.txt`
- `assets/`: CSS and fingerprinted images processed by Hugo Pipes
- `static/`: the custom domain, web manifest assets, and install icons
- `e2e/`: Playwright and Axe validation of generated pages and endpoints
- `scripts/`: the direct Lighthouse threshold runner
- `.github/workflows/`: validation, deployment, and production auditing

Contact details, headings, skills, and external links live in
`config/_default/params.toml`. The homepage summary is in `content/_index.md`.
Changing these files updates both visible content and generated metadata where
appropriate.

## CI and deployment

Pull requests to `main` run formatting, linting, dependency audit, a strict
production Hugo build, Playwright/Axe tests, endpoint and resource integrity
checks, and Lighthouse thresholds. Pushes to `main` run the same validation,
then deploy that exact validated artifact to the GitHub Pages deployment branch.

After deployment, a separate workflow waits until the matching commit revision
is live at `vladan.dev` and runs a production Lighthouse audit with three
samples. Dependencies and pinned GitHub Actions are checked weekly by
Dependabot.

## License

The original source code and project materials in this repository are licensed
under the [MIT License](./LICENSE), provided the copyright and license notices
are retained. The MIT License includes an express disclaimer of warranties and
limitation of liability.

The portfolio text, personal details, photographs, names, logos, trademarks,
and other assets owned by third parties are not licensed by this notice unless
explicitly stated otherwise. Obtain any permissions needed for those materials
before reusing them.
