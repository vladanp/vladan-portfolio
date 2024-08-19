# Vladan Petrovic Portfolio

This is the source code for the portfolio of Vladan Petrovic, a Senior Software Engineer. The site is built using <a href="https://gohugo.io/" target="_blank">Hugo</a>, a fast and flexible static site generator.

## Project Structure

- **content/**: Markdown files for each page on the site.
- **layouts/**: Custom HTML and templates for the site.
- **static/**: Static files like images, CSS, and JavaScript.
- **hugo.toml**: Main configuration file for the Hugo site.

## How to Run the Project Locally

To run the Hugo site locally, you'll need to have <a href="https://gohugo.io/" target="_blank">Hugo</a> installed on your machine.

### Steps:

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
