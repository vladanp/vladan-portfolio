# Vladan Petrovic Portfolio

[![Deploy](https://github.com/vladanp/vladan-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/vladanp/vladan-portfolio/actions/workflows/deploy.yml)

[![E2E Tests](https://github.com/vladanp/vladan-portfolio/actions/workflows/e2e.yml/badge.svg)](https://github.com/vladanp/vladan-portfolio/actions/workflows/e2e.yml)

[![SEO Audit](https://github.com/vladanp/vladan-portfolio/actions/workflows/audit.yml/badge.svg)](https://github.com/vladanp/vladan-portfolio/actions/workflows/audit.yml)

This is the source code for the portfolio of Vladan Petrovic, a Senior Software Engineer. The site is built using [Hugo](https://gohugo.io/), a fast and flexible static site generator.

## Table of Contents

[Project Structure](#project-structure)

[How to Run the Project Locally](#how-to-run-the-project-locally)

[How to Run the Project Locally with Docker](#how-to-run-the-project-locally-with-docker)

[Running Tests](#running-tests)

[Deployment](#deployment)

[License](#license)

## Project Structure

- **config/\_default/**: Hugo configuration files (hugo.toml, params.toml, sitemap.toml).
- **content/**: Markdown files for each page on the site.
- **layouts/**: Custom HTML templates and partials for the site.
- **assets/**: CSS and images processed by Hugo Pipes.
- **static/**: Static files served as-is (CNAME, robots.txt).

## How to Run the Project Locally

This project uses [mise](https://mise.jdx.dev/) to manage tool versions. The `.mise.toml` file pins Hugo, Node.js, and pnpm.

**Prerequisites:** Hugo 0.161.1, Node.js 24, pnpm 11

```bash
git clone https://github.com/vladanp/vladan-portfolio.git
cd vladan-portfolio

# If using mise:
mise trust && mise install

# Install test dependencies
pnpm install

# Start the Hugo dev server
hugo server --baseURL http://localhost:1313 --disableFastRender --noHTTPCache
```

Open [http://localhost:1313](http://localhost:1313) to view the site.

## How to Run the Project Locally with Docker

No local toolchain required.

```bash
git clone https://github.com/vladanp/vladan-portfolio.git
cd vladan-portfolio
docker compose up
```

Open [http://localhost:1313](http://localhost:1313) to view the site.

## Running Tests

End-to-end tests use [Playwright](https://playwright.dev/). The Hugo dev server starts and stops automatically.

```bash
pnpm install                     # first time only
pnpm exec playwright install chromium  # first time only

pnpm test                        # run all tests
pnpm test:headed                 # watch the browser
pnpm test:ui                     # interactive UI mode
```

Tests run automatically on pull requests to `main` via GitHub Actions.

## Deployment

The site is automatically deployed to GitHub Pages whenever changes are pushed to the main branch. The deployment process is managed via GitHub Actions, using the following workflow:

1. Ensure the main branch is up to date with your latest changes.

2. Push your changes to the main branch:

   ```bash
   git push origin main
   ```

3. GitHub Actions will automatically build and deploy the site to the gh-pages branch, which is configured to serve the site.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.
