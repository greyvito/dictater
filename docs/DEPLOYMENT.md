# Deployment

## Static frontend (GitHub Pages)

Pushes to `main` deploy automatically via [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

Live URL: `https://greyvito.github.io/dictater/`

### First-time setup (required once)

GitHub Pages must be enabled before the deploy job can publish:

1. Open [github.com/greyvito/dictater/settings/pages](https://github.com/greyvito/dictater/settings/pages)
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Re-run the failed deploy workflow: [Actions → Deploy to GitHub Pages → Re-run all jobs](https://github.com/greyvito/dictater/actions/workflows/deploy.yml)

Or from the CLI after enabling Pages:

```bash
gh workflow run deploy.yml
```

Local production preview:

```bash
GITHUB_PAGES=true npm run build
npm run preview
```

## Full stack (frontend + API)

Run the combined production server:

```bash
npm run build
npm run start:prod
```

This serves the built app from `dist/` and the API on port 3001 (configurable via `PORT`).

## Netlify

1. Connect the repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Point `/api/*` to your backend host (see `netlify.toml`)

## Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | API / combined server port (default 3001) |
| `GITHUB_PAGES` | Set to `true` when building for GitHub Pages (`base: /dictater/`) |

## Teacher portal

Available at `/teacher.html` on the same host as the student app.
