# Dictater — English Learning Studio

Dictater is a web application for **PreK through Grade 6** English learning, covering listening, speaking, reading, writing, phonics, grammar, and vocabulary.

Built with **Vite + vanilla JavaScript modules**, it runs as a static PWA with optional cloud sync via a lightweight API.

## Features

- **PreK activities**: rhyme match, syllable count, beginning sounds, letter-sound match, picture vocabulary, repeat-after-me speaking
- **K–6 activities**: dictation, spelling, speaking (word/sentence/passage), reading comprehension, grammar, vocabulary, phonics blend, sentence builder, writing prompts
- **Speaking training**: Web Speech API recognition with word-level correctness feedback
- **Adaptive learning**: placement mini-test, skill mastery tracking, lesson recommendations
- **Progress journal**: stats, streaks, badges (localStorage + IndexedDB)
- **Teacher portal**: class creation and progress reports (`teacher.html` + API)
- **541+ curriculum lessons** in validated JSON format

## Quick Start

```bash
npm install
npm run dev        # Development server at http://localhost:5173
npm run build      # Production build to dist/
npm start          # Preview production build
npm test           # Run unit tests
npm run validate:content  # Validate curriculum JSON
npm run backend    # Start API server on port 3001
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
