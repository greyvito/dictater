import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const curriculumDir = path.join(root, 'curriculum');
const outDir = path.join(root, 'content');

const grades = ['K', '1', '2', '3', '4', '5', '6'];

function loadGradeFile(filePath, gradeKey) {
  const src = fs.readFileSync(filePath, 'utf8');
  const sandbox = { DICTATER_CURRICULUM: {} };
  const fn = new Function('window', src + `\nreturn window.DICTATER_CURRICULUM['${gradeKey}'];`);
  return fn(sandbox);
}

grades.forEach((g) => {
  const file = path.join(curriculumDir, g === 'K' ? 'gradeK.js' : `grade${g}.js`);
  if (!fs.existsSync(file)) return;
  let data;
  try {
    data = loadGradeFile(file, g);
  } catch (e) {
    console.warn('Failed', g, e.message);
    return;
  }
  if (!data) return;

  const existingPath = path.join(outDir, g, 'index.json');
  /** @type {unknown[]} */
  let existing = [];
  if (fs.existsSync(existingPath)) {
    existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  }

  const lessons = [...existing];
  const existingIds = new Set(existing.map((l) => l.id));

  (data.passages || []).forEach((p) => {
    if (!existingIds.has(p.id)) {
      lessons.push({
        id: p.id,
        grade: g,
        type: 'dictation',
        difficulty: p.difficulty,
        title: p.title,
        hint: p.hint,
        skills: ['listening', 'writing'],
        content: { text: p.text }
      });
    }
    const compId = p.id + '-comp';
    if (!existingIds.has(compId)) {
      lessons.push({
        id: compId,
        grade: g,
        type: 'comprehension',
        difficulty: p.difficulty,
        title: 'Comprehension: ' + p.title,
        skills: ['reading_comprehension'],
        content: {
          passage: p.text,
          questions: [
            {
              question: 'What is this passage mostly about?',
              choices: ['The main topic', 'A different story', 'Nothing at all'],
              correctIndex: 0
            }
          ]
        },
        hint: 'Read carefully, then answer.'
      });
    }
  });

  (data.words || []).forEach((w) => {
    if (!existingIds.has(w.id)) {
      lessons.push({
        id: w.id,
        grade: g,
        type: 'spelling',
        difficulty: w.difficulty,
        title: w.title,
        hint: w.hint,
        skills: ['spelling'],
        content: { words: w.words }
      });
    }
    const speakId = w.id + '-speak';
    if (!existingIds.has(speakId)) {
      lessons.push({
        id: speakId,
        grade: g,
        type: 'speak_word',
        difficulty: w.difficulty,
        title: 'Speak: ' + w.title,
        skills: ['speaking', 'oral_fluency'],
        content: { words: w.words, maxAttempts: 3 },
        hint: 'Say each word after you hear it.'
      });
    }
  });

  const gradeOut = path.join(outDir, g);
  fs.mkdirSync(gradeOut, { recursive: true });
  fs.writeFileSync(path.join(gradeOut, 'index.json'), JSON.stringify(lessons, null, 2));
  console.log(`Grade ${g}: ${lessons.length} lessons`);
});
