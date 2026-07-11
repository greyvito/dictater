# Manual QA Checklist (Local Laptop)

Use this after `npm run local:full` with Chrome. ~20 minutes with a child or solo.

## Setup
- [ ] `git pull && npm install`
- [ ] Whisper venv set up (see [LOCAL.md](LOCAL.md))
- [ ] `npm run local:full` running
- [ ] Chrome, microphone allowed

## PreK (5 min)
- [ ] Select **PreK** — rainbow theme appears
- [ ] **Vocabulary → Word: dog** — picture cards, mascot, confetti on correct tap
- [ ] **Sounds → Rhyme: cat** — prompt image + choice images
- [ ] **Speaking → Say: cat** — shows "Using local Whisper" if server running
- [ ] Tap wrong answer — gentle sound, mascot encourages retry

## Grade 3 sample (5 min)
- [ ] **Listening → dictation** — TTS plays, typing works, Check Answer
- [ ] **Speaking → speak sentence** — mic records, word feedback colors
- [ ] **Reading → comprehension** — passage + questions score

## Teacher flow (5 min)
- [ ] Open http://localhost:5173/teacher.html
- [ ] Create class, enroll student email
- [ ] Assign lesson `preK-rhyme-01`
- [ ] Student sign-in → assignment appears in sidebar → opens lesson

## Persistence (2 min)
- [ ] Change grade/skill, reload page — selection restored
- [ ] Export progress JSON downloads

## Edge cases
- [ ] Language toggle EN → ES — labels update
- [ ] Custom lesson create + run
- [ ] Stop Whisper (`Ctrl+C` on whisper only) — speaking falls back to browser STT

## Report issues
Note: lesson id, browser, expected vs actual. File GitHub issues or fix JSON in `content/`.
