# Vladan Petrovic Portfolio

[![Deploy Hugo Site](https://github.com/vladanp/vladan-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/vladanp/vladan-portfolio/actions/workflows/deploy.yml)

This is the source code for the portfolio of Vladan Petrovic, a Senior Software Engineer. The site is built using [Hugo](https://gohugo.io/), a fast and flexible static site generator.

## Table of Contents
[Project Structure](#project-structure)

[How to Run the Project Locally](#how-to-run-the-project-locally)

[How to Run the Project Locally with Docker](#how-to-run-the-project-locally-with-docker)

[Deployment](#deployment)

[License](#license)

## Project Structure

- **content/**: Markdown files for each page on the site.
- **layouts/**: Custom HTML and templates for the site.
- **static/**: Static files like images, CSS, and JavaScript.
- **hugo.toml**: Main configuration file for the Hugo site.

## How to Run the Project Locally

To run the Hugo site locally, you'll need to have <a href="https://gohugo.io/" target="_blank">Hugo</a> installed on your machine.

1. Clone the repository:
   ```bash
   git clone https://github.com/vladanp/vladan-portfolio.git
   cd vladan-portfolio
   ```
2. Start the Hugo server:
   ```bash
   hugo server -D
   ```
3. Open your web browser and go to [http://localhost:1313](http://localhost:1313) to view the site.

## How to Run the Project Locally with Docker

To run the Hugo site locally using Docker, follow these steps:

1. Download and install Docker Desktop from the official Docker website.

2. Clone the repository:
   ```bash
   git clone https://github.com/vladanp/vladan-portfolio.git
   cd vladan-portfolio
   ```

3. Start the Hugo server using Docker:
   ```bash
   docker compose up --build
   ```

4. Open your web browser and go to [http://localhost:1313](http://localhost:1313) to view the site.

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
