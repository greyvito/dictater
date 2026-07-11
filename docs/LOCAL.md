# Run Dictater on Your Laptop

Everything runs locally — no GitHub Pages or cloud hosting required.

## Requirements

- **Node.js 20+** — https://nodejs.org
- **Chrome or Edge** — for speaking / microphone activities
- **Microphone** — optional but needed for speak & PreK repeat lessons

## Quick start (recommended)

```bash
git clone https://github.com/greyvito/dictater.git
cd dictater
npm install
npm run local
```

Then open:

| What | URL |
|------|-----|
| Student app | http://localhost:5173 |
| Teacher portal | http://localhost:5173/teacher.html |
| API | http://localhost:3001 |

`npm run local` starts the dev server and API together. Press **Ctrl+C** to stop both.

## Alternative: production-like single server

```bash
npm install
npm run build
npm run start:prod
```

Open **http://localhost:3001** — app and API on one port.

## What works offline

These work **without** the API (progress saved in your browser):

- All 889 lessons (PreK picture cards, dictation, spelling, etc.)
- Text-to-speech (browser voices + optional Puter/Kokoro in settings)
- Speaking practice (Chrome Web Speech → local word scoring, no LLM)
- Badges, streaks, session restore, progress export

## What needs the API running

Start `npm run backend` or use `npm run local`:

- Student sign-in & cloud sync
- Teacher assignments
- Class reports & CSV export

Data is stored in `backend/data/db.json` on your machine.

## Speaking tips (laptop)

1. Use **Google Chrome**
2. Allow microphone when prompted
3. Try: **PreK → Vocabulary → Word: dog** or **Grade 3 → Speaking**
4. Quiet room helps — scoring uses speech-to-text + word matching (not an LLM)

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 5173 in use | Kill other Vite apps or change port in `vite.config.js` |
| Port 3001 in use | `PORT=3002 npm run backend` |
| Mic not working | Chrome settings → Privacy → Microphone |
| Speaking always fails | Use Chrome/Edge; Safari/Firefox have limited STT |
| Blank page after build | Run from repo root; use `npm run start:prod` not opening `index.html` directly |

## Optional: open on your home network

Share with a tablet on the same Wi‑Fi:

```bash
npm run dev -- --host
npm run backend
```

Visit `http://<your-laptop-ip>:5173` from the tablet (still use Chrome for speaking).
