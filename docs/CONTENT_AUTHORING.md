# Content Authoring

Curriculum lessons live in `content/<grade>/index.json`.

## Workflow

1. Add or edit JSON lesson objects following the schema in `src/curriculum/schema.js`
2. Run `npm run validate:content` to check structure
3. Run `npm run expand:content` to generate additional pack lessons (idempotent; target 800+)
4. Open a PR for review (Git-based CMS for v1)

## Lesson template

```json
{
  "id": "unique-id",
  "grade": "3",
  "type": "comprehension",
  "difficulty": "beginner",
  "title": "Lesson title",
  "skills": ["reading_comprehension"],
  "standards": ["CCSS.ELA-LITERACY.RL.3.1"],
  "content": {},
  "hint": "Helper text for students"
}
```

Supported activity types are listed in `src/curriculum/schema.js`.

Topical PreK/K vocabulary (17 units) can be regenerated with:

```bash
npm run generate:topic-lessons
```

Review mixes (4 per grade, one per units 1–4 / 5–8 / 9–12 / 13–17) and K speak_sentence variants live in `scripts/prek-topics.mjs`.

### Word-intro audio (cached TTS)

Pre-generated pronunciation files speed up `word_intro` lessons (cached audio with live TTS fallback).

```bash
# Terminal 1 — local TTS server (one-time: python3 -m venv venv && pip install kokoro-mlx soundfile mlx piper-tts)
npm run tts

# Terminal 2 — generate WAV files + manifest
npm run generate:word-audio
# Optional: npm run generate:word-audio -- --engine kokoro-mlx --voice af_heart --force
```

Output: `public/audio/words/<word-slug>.wav` and `public/audio/words/manifest.json`.  
The app loads the manifest and plays cached audio in `word_intro`; missing files fall back to the configured TTS engine.
