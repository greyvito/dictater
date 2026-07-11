# Deployment

## Static frontend (GitHub Pages)

Pushes to `main` deploy automatically via [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

Live URL (after enabling Pages in repo settings): `https://greyvito.github.io/dictater/`

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
