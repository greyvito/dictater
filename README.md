# Dictater — English Learning Studio

Dictater is a web application for **PreK through Grade 6** English learning, covering listening, speaking, reading, writing, phonics, grammar, and vocabulary.

Built with **Vite + vanilla JavaScript modules**, it runs as a static PWA with optional cloud sync via a lightweight API.

## Features

- **PreK activities**: rhyme match, syllable count, beginning sounds, letter-sound match, picture vocabulary, repeat-after-me speaking
- **K–6 activities**: dictation, spelling, speaking (word/sentence/passage), reading comprehension, grammar, vocabulary, phonics blend, sentence builder, writing prompts
- **Speaking training**: Web Speech API recognition with word-level correctness feedback
- **Adaptive learning**: placement mini-test, skill mastery tracking, lesson recommendations
- **Progress journal**: stats, streaks, badges (localStorage + IndexedDB)
- **Teacher portal**: class creation, enrollments, assignments, CSV reports (`teacher.html` + API)
- **Student assignments**: signed-in learners see teacher-assigned lessons in the sidebar
- **English / Spanish UI** toggle (i18n for shell labels)
- **COPPA-lite cloud sync**: optional sign-in with parent/guardian consent checkbox
- **Progress export**: download stats and analytics events as JSON
- **889 curriculum lessons** in validated JSON format (expand with `npm run expand:content`)

## Quick Start

```bash
npm install
npm run dev        # Development server at http://localhost:5173
npm run build      # Production build to dist/
npm start          # Preview production build
npm test           # Run unit tests
npm run validate:content  # Validate curriculum JSON
npm run backend    # Start API server on port 3001
npm run start:prod # Build + serve dist/ and API together (after npm run build)
npm run expand:content  # Add grammar/vocab/writing packs per grade (target 800+)
```

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for GitHub Pages, Netlify, and combined production server setup.

```bash
GITHUB_PAGES=true npm run build   # For https://<user>.github.io/dictater/
npm run build && npm run start:prod  # Self-hosted full stack
```

## Project Structure

```
src/
  App.js              # Main application orchestrator
  activities/         # Activity plugins (dictation, speaking, prek, etc.)
  adaptive/           # Placement and recommendations
  curriculum/         # Schema and JSON loader
  grading/            # LCS word alignment (shared by dictation + speaking)
  speech/             # TTS and STT modules
  app/                # Storage and API client
content/              # Curriculum JSON by grade
backend/              # Express API for auth, sync, teacher tools
tests/                # Vitest unit tests
```

## Curriculum

Lessons live in `content/<grade>/index.json`. See [docs/CONTENT_AUTHORING.md](docs/CONTENT_AUTHORING.md).

To regenerate K–6 JSON from legacy JS files:

```bash
npm run migrate:curriculum
```

## License

MIT
