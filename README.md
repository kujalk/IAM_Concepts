# IAM Concepts Study Guide

Interactive study guides for Identity and Access Management concepts built with React, Vite, and Tailwind CSS.

**Live site:** [https://kujalk.github.io/IAM_Concepts/](https://kujalk.github.io/IAM_Concepts/)

## Topics Covered

- **JWT Deep Dive** — Structure, signing algorithms, claims, and GCP federation mapping
- **OAuth2, OIDC & SSO** — Protocols, grant types, tokens, and real-world flows
- **Kerberos** — Classic network authentication protocol

## Tech Stack

- React 19 + React Router 7
- Vite 6
- Tailwind CSS 3
- GitHub Pages (via `gh-pages`)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Git](https://git-scm.com/)
- A GitHub account

## Local Development

```bash
# Clone the repository
git clone https://github.com/kujalk/IAM_Concepts.git
cd IAM_Concepts

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173/IAM_Concepts/`.

## Deploy to GitHub Pages

### Option 1 — Deploy from your CLI (quickest)

The project already has a deploy script that builds the app and pushes the `dist/` folder to the `gh-pages` branch.

```bash
npm run deploy
```

This runs `vite build` (via the `predeploy` hook) and then `gh-pages -d dist`.

### Option 2 — Fork and deploy your own copy

1. **Fork the repo** — Click the **Fork** button on [https://github.com/kujalk/IAM_Concepts](https://github.com/kujalk/IAM_Concepts).

2. **Clone your fork**

   ```bash
   git clone https://github.com/<your-username>/IAM_Concepts.git
   cd IAM_Concepts
   ```

3. **Update the base path** — Open [vite.config.js](vite.config.js) and confirm the `base` matches your repo name:

   ```js
   base: '/IAM_Concepts/',
   ```

   If you renamed the repo, change this value to `/<your-repo-name>/`.

4. **Install dependencies and deploy**

   ```bash
   npm install
   npm run deploy
   ```

5. **Enable GitHub Pages** — In your repo go to **Settings > Pages**, set the source to **Deploy from a branch**, and select the `gh-pages` branch with `/ (root)`.

6. Your site will be live at `https://<your-username>.github.io/IAM_Concepts/`.

### Option 3 — GitHub Actions (CI/CD)

For automatic deploys on every push to `main`, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - id: deployment
        uses: actions/deploy-pages@v4
```

Then go to **Settings > Pages** and set the source to **GitHub Actions**.

## Project Structure

```
IAM_Concepts/
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Routing setup
│   ├── pagesConfig.js      # Page registry
│   └── components/         # Layout, Sidebar, HomePage
├── Pages/                  # Study guide pages (lazy loaded)
├── vite.config.js          # Vite config (base path set here)
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Scripts and dependencies
```

## Adding a New Guide

1. Create a new component in the [Pages/](Pages/) directory.
2. Register it in [src/pagesConfig.js](src/pagesConfig.js) with a path, title, icon, and category.
3. The sidebar and home page will pick it up automatically.
