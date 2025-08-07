# Personal Website - 42fu.com

Modern Jekyll-powered personal website with animated cycloid banner and responsive design.

## Features

- Modern Jekyll 4.x setup
- Responsive design with dark/light mode support
- Animated mathematical cycloid visualization
- SEO optimized with structured data
- GitHub Actions automated deployment

## Development

```bash
# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# Build for production
bundle exec jekyll build
```

## Deployment

This site automatically deploys to GitHub Pages using GitHub Actions when changes are pushed to the `master` branch.

## Structure

- `index.html` - Main landing page
- `_layouts/default.html` - Page layout template
- `assets/css/main.css` - Styles with CSS variables for theming
- `assets/js/main.js` - Cycloid animation and interactive features
- `_config.yml` - Jekyll configuration
- `.github/workflows/jekyll.yml` - CI/CD pipeline

## Domain

Custom domain: `www.42fu.com` (configured via CNAME file)