# Run Dictater on Your Laptop

Everything runs locally — no GitHub Pages or cloud hosting required.

## Requirements

- **Node.js 20+** — https://nodejs.org
- **Chrome or Edge** — for speaking / microphone activities
- **Python 3.10+** — optional, for local Whisper (better speaking accuracy)
- **ffmpeg** — optional, helps Whisper decode audio (`brew install ffmpeg` / `sudo apt install ffmpeg`)

## Quick start (recommended)

```bash
git clone https://github.com/greyvito/dictater.git
cd dictater
npm install
npm run local
```

For **best speaking accuracy**, also set up Whisper (one time):

```bash
cd speech-server
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ..
npm run local:full                 # app + API + Whisper
```

Then open:

| What | URL |
|------|-----|
| Student app | http://localhost:5173 |
| Teacher portal | http://localhost:5173/teacher.html |
| API | http://localhost:3001 |

`npm run local` starts the dev server and API together. Press **Ctrl+C** to stop both.

| Command | What it starts |
|---------|------------------|
| `npm run local` | Dev app (:5173) + API (:3001) |
| `npm run local:full` | Above + Whisper (:3002) if venv exists |
| `npm run whisper` | Whisper server only |

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
- Speaking practice — **local Whisper** (recommended) or Chrome Web Speech → word scoring (no LLM)
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
3. **Recommended:** run `npm run local:full` so speaking uses **local Whisper** (free, open source, runs on your CPU)
4. Try: **PreK → Speaking → Say: cat** or **Grade 3 → Speaking**
5. First Whisper run downloads the `tiny` model (~75 MB) — be patient
6. Override model: `WHISPER_MODEL=base npm run whisper` (more accurate, slower)

When Whisper is active, speaking lessons show: *"Using local Whisper (tiny)"*.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Whisper not available | Run speech-server setup above; then `npm run whisper` in another terminal |
| Whisper slow on laptop | Use `WHISPER_MODEL=tiny` (default) or close other apps |
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
