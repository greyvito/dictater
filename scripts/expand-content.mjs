import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', 'content');

const GRAMMAR_TEMPLATES = [
  {
    suffix: 'gram-cap',
    title: 'Capital Letters',
    question: 'Which sentence is correct?',
    choices: ['I like cats.', 'i like cats.', 'I Like cats.'],
    correctIndex: 0
  },
  {
    suffix: 'gram-plural',
    title: 'Plurals',
    question: 'Choose the correct plural.',
    choices: ['dogs', 'doges', 'dog'],
    correctIndex: 0
  },
  {
    suffix: 'gram-verb',
    title: 'Verb Tense',
    question: 'She ___ to school every day.',
    choices: ['go', 'goes', 'going'],
    correctIndex: 1
  }
];

const VOCAB_TEMPLATES = [
  {
    suffix: 'vocab-ctx-1',
    title: 'Word in Context',
    question: 'We felt ___ when we won the game.',
    choices: ['happy', 'slowly', 'because'],
    correctIndex: 0
  },
  {
    suffix: 'vocab-ctx-2',
    title: 'Opposite Words',
    question: 'Hot is the opposite of ___.',
    choices: ['cold', 'warm', 'fire'],
    correctIndex: 0
  }
];

const WRITING_TEMPLATES = [
  {
    suffix: 'write-prompt-1',
    title: 'Write About Your Favorite Place',
    prompt: 'Describe your favorite place and why you like it.',
    minWords: 20
  }
];

function expandGrade(gradeKey) {
  const file = path.join(contentDir, gradeKey, 'index.json');
  if (!fs.existsSync(file)) return 0;
  const lessons = JSON.parse(fs.readFileSync(file, 'utf8'));
  const ids = new Set(lessons.map((l) => l.id));
  let added = 0;

  const add = (lesson) => {
    if (ids.has(lesson.id)) return;
    lessons.push(lesson);
    ids.add(lesson.id);
    added++;
  };

  GRAMMAR_TEMPLATES.forEach((t) => {
    add({
      id: `g${gradeKey}-${t.suffix}`,
      grade: gradeKey,
      type: 'grammar_fix',
      difficulty: 'beginner',
      title: t.title,
      skills: ['grammar'],
      content: {
        questions: [{ question: t.question, choices: t.choices, correctIndex: t.correctIndex }]
      },
      hint: 'Pick the best answer.'
    });
  });

  VOCAB_TEMPLATES.forEach((t) => {
    add({
      id: `g${gradeKey}-${t.suffix}`,
      grade: gradeKey,
      type: 'vocabulary_context',
      difficulty: 'beginner',
      title: t.title,
      skills: ['vocabulary'],
      content: {
        questions: [{ question: t.question, choices: t.choices, correctIndex: t.correctIndex }]
      },
      hint: 'Use context clues.'
    });
  });

  if (gradeKey !== 'preK' && gradeKey !== 'K') {
    WRITING_TEMPLATES.forEach((t) => {
      add({
        id: `g${gradeKey}-${t.suffix}`,
        grade: gradeKey,
        type: 'writing_prompt',
        difficulty: 'intermediate',
        title: t.title,
        skills: ['writing'],
        content: {
          prompt: t.prompt,
          minWords: t.minWords,
          checklist: ['Complete sentences', 'Clear ideas']
        },
        hint: 'Write in full sentences.'
      });
    });
  }

  if (added) {
    fs.writeFileSync(file, JSON.stringify(lessons, null, 2));
  }
  return added;
}

const grades = ['preK', 'K', '1', '2', '3', '4', '5', '6'];
let total = 0;
grades.forEach((g) => {
  const n = expandGrade(g);
  if (n) console.log(`Grade ${g}: +${n} lessons`);
  total += n;
});
console.log(`Total added: ${total}`);
