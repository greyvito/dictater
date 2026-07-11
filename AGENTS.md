# AGENTS.md

## Cursor Cloud specific instructions

Dictater is a Vite + vanilla-JS PWA (the product) with an optional Express backend. Standard commands live in `README.md` and `package.json` scripts; only non-obvious caveats are captured here.

### Services
- **Frontend (Vite dev server)** — the product. Run `npm run dev` → http://localhost:5173. This is the only service required to develop/test the core learning app; all progress persists locally via `localStorage` + IndexedDB (Dexie).
- **Backend (Express API)** — optional. Run `npm run backend` → http://localhost:3001. Only needed for login-based cloud sync and the teacher portal (`teacher.html`). Vite proxies `/api` → `:3001` (see `vite.config.js`), so start the backend before exercising login/sync/teacher flows. It persists to a local JSON file at `backend/data/db.json` (auto-created, gitignored; no external database).

### Caveats
- **Audio/speech won't work in the cloud VM.** Activities using the Web Speech API (TTS "Play Phrase" and speaking/STT recognition) fail with a "Could not play audio" toast because the headless VM has no audio device or speech engine. This is an environment limitation, not a bug — text-based activities (dictation typing, spelling, reading, grammar, vocabulary) still work end-to-end and register scores/achievements.
- Node 22 is present and works; CI (`.github/workflows/ci.yml`) pins Node 20.
- **No linter is configured** (no ESLint/Prettier). CI runs `npm run validate:content`, `npm test`, `npm run build` — mirror these to validate changes. `npm run validate:content` checks all `content/**/index.json` lessons against `src/curriculum/schema.js`.
