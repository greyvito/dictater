import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  EXTRA_GRAMMAR,
  EXTRA_VOCAB,
  EXTRA_WRITING,
  COMPREHENSION_BY_GRADE,
  SPEAK_SENTENCES_BY_GRADE,
  SPEAK_PASSAGES_BY_GRADE,
  SENTENCE_BUILDERS_BY_GRADE,
  PHONICS_BLENDS,
  SIGHT_WORDS,
  PREK_PACK,
  K_COMPREHENSION,
  SPELLING_PACKS_BY_GRADE,
  DICTATION_PACKS_BY_GRADE
} from './content-banks.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', 'content');
const TARGET_MIN = 800;

const LEGACY_GRAMMAR = [
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

const LEGACY_VOCAB = [
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

const LEGACY_WRITING = [
  {
    suffix: 'write-prompt-1',
    title: 'Write About Your Favorite Place',
    prompt: 'Describe your favorite place and why you like it.',
    minWords: 20,
    difficulty: 'intermediate'
  }
];

function grammarLesson(gradeKey, t) {
  return {
    id: `g${gradeKey}-${t.suffix}`,
    grade: gradeKey,
    type: 'grammar_fix',
    difficulty: t.difficulty || 'beginner',
    title: t.title,
    skills: ['grammar'],
    content: {
      questions: [{ question: t.question, choices: t.choices, correctIndex: t.correctIndex }]
    },
    hint: t.hint || 'Pick the best answer.'
  };
}

function vocabLesson(gradeKey, t) {
  return {
    id: `g${gradeKey}-${t.suffix}`,
    grade: gradeKey,
    type: 'vocabulary_context',
    difficulty: t.difficulty || 'beginner',
    title: t.title,
    skills: ['vocabulary'],
    content: {
      questions: [{ question: t.question, choices: t.choices, correctIndex: t.correctIndex }]
    },
    hint: t.hint || 'Use context clues.'
  };
}

function writingLesson(gradeKey, t) {
  return {
    id: `g${gradeKey}-${t.suffix}`,
    grade: gradeKey,
    type: 'writing_prompt',
    difficulty: t.difficulty || 'intermediate',
    title: t.title,
    skills: ['writing'],
    content: {
      prompt: t.prompt,
      minWords: t.minWords,
      checklist: ['Complete sentences', 'Clear ideas']
    },
    hint: 'Write in full sentences.'
  };
}

function comprehensionLesson(gradeKey, t) {
  return {
    id: `g${gradeKey}-${t.suffix}`,
    grade: gradeKey,
    type: 'comprehension',
    difficulty: t.difficulty || 'beginner',
    title: t.title,
    skills: ['reading_comprehension'],
    content: {
      passage: t.passage,
      questions: t.questions
    },
    hint: t.hint || 'Read the passage carefully.'
  };
}

function buildLessonsForGrade(gradeKey) {
  const out = [];

  if (!['preK', 'K'].includes(gradeKey)) {
    [...LEGACY_GRAMMAR, ...EXTRA_GRAMMAR].forEach((t) => out.push(grammarLesson(gradeKey, t)));
    [...LEGACY_VOCAB, ...EXTRA_VOCAB].forEach((t) => out.push(vocabLesson(gradeKey, t)));
  }

  if (gradeKey !== 'preK' && gradeKey !== 'K') {
    [...LEGACY_WRITING, ...EXTRA_WRITING].forEach((t) => out.push(writingLesson(gradeKey, t)));
  }

  if (gradeKey === 'preK') {
    PREK_PACK.rhymes.forEach((t) =>
      out.push({
        id: `preK-${t.suffix}`,
        grade: 'preK',
        type: 'phonological_rhyme',
        difficulty: 'beginner',
        title: t.title,
        skills: ['rhyme_recognition'],
        content: { prompt: t.prompt, choices: t.choices, correctIndex: t.correctIndex },
        hint: 'Rhyming words sound the same at the end.'
      })
    );
    PREK_PACK.syllables.forEach((t) =>
      out.push({
        id: `preK-${t.suffix}`,
        grade: 'preK',
        type: 'phonological_syllable',
        difficulty: 'beginner',
        title: t.title,
        skills: ['syllable_count'],
        content: { prompt: t.prompt, choices: t.choices, correctIndex: t.correctIndex },
        hint: 'Clap for each syllable.'
      })
    );
    PREK_PACK.initials.forEach((t) =>
      out.push({
        id: `preK-${t.suffix}`,
        grade: 'preK',
        type: 'phonological_initial',
        difficulty: 'beginner',
        title: t.title,
        skills: ['initial_sound'],
        content: { prompt: t.prompt, choices: t.choices, correctIndex: t.correctIndex },
        hint: 'Listen to the first sound.'
      })
    );
    PREK_PACK.letters.forEach((t) =>
      out.push({
        id: `preK-${t.suffix}`,
        grade: 'preK',
        type: 'letter_sound',
        difficulty: 'beginner',
        title: t.title,
        skills: ['letter_sound'],
        content: { letter: t.letter, choices: t.choices, correctIndex: t.correctIndex },
        hint: 'Which word starts with this letter?'
      })
    );
    PREK_PACK.speak.forEach((t) =>
      out.push({
        id: `preK-${t.suffix}`,
        grade: 'preK',
        type: 'speak_repeat',
        difficulty: 'beginner',
        title: t.title,
        skills: ['speaking', 'oral_fluency'],
        content: { prompt: t.prompt, expectedText: t.expectedText, maxAttempts: 2 },
        hint: 'Repeat the word clearly.'
      })
    );
  }

  if (gradeKey === 'K') {
    K_COMPREHENSION.forEach((t) => out.push(comprehensionLesson(gradeKey, t)));
    PHONICS_BLENDS.slice(0, 3).forEach((t) =>
      out.push({
        id: `gK-${t.suffix}`,
        grade: 'K',
        type: 'phonics_blend',
        difficulty: 'beginner',
        title: t.title,
        skills: ['phonics'],
        content: { targetWord: t.targetWord, tiles: t.tiles, prompt: t.prompt },
        hint: 'Blend the sounds together.'
      })
    );
    SIGHT_WORDS.slice(0, 4).forEach((t) =>
      out.push({
        id: `gK-${t.suffix}`,
        grade: 'K',
        type: 'sight_word',
        difficulty: 'beginner',
        title: t.title,
        skills: ['reading'],
        content: { word: t.word, sentence: t.sentence },
        hint: 'Read the sight word.'
      })
    );
  }

  if (['K', '1', '2'].includes(gradeKey) && gradeKey !== 'K') {
    PHONICS_BLENDS.forEach((t) =>
      out.push({
        id: `g${gradeKey}-${t.suffix}`,
        grade: gradeKey,
        type: 'phonics_blend',
        difficulty: gradeKey === '1' ? 'beginner' : 'intermediate',
        title: t.title,
        skills: ['phonics'],
        content: { targetWord: t.targetWord, tiles: t.tiles, prompt: t.prompt },
        hint: 'Put the sounds together.'
      })
    );
  }

  if (gradeKey === '1') {
    SIGHT_WORDS.forEach((t) =>
      out.push({
        id: `g1-${t.suffix}`,
        grade: '1',
        type: 'sight_word',
        difficulty: 'intermediate',
        title: t.title,
        skills: ['reading'],
        content: { word: t.word, sentence: t.sentence },
        hint: 'Practice high-frequency words.'
      })
    );
  }

  (COMPREHENSION_BY_GRADE[gradeKey] || []).forEach((t) => out.push(comprehensionLesson(gradeKey, t)));

  (SPEAK_SENTENCES_BY_GRADE[gradeKey] || []).forEach((t) =>
    out.push({
      id: `g${gradeKey}-${t.suffix}`,
      grade: gradeKey,
      type: 'speak_sentence',
      difficulty: 'beginner',
      title: t.title,
      skills: ['speaking', 'oral_fluency'],
      content: { sentences: t.sentences, maxAttempts: 3 },
      hint: 'Say the full sentence clearly.'
    })
  );

  (SPEAK_PASSAGES_BY_GRADE[gradeKey] || []).forEach((t) =>
    out.push({
      id: `g${gradeKey}-${t.suffix}`,
      grade: gradeKey,
      type: 'speak_passage',
      difficulty: 'intermediate',
      title: t.title,
      skills: ['speaking', 'oral_fluency'],
      content: { expectedText: t.text, text: t.text, maxAttempts: 2 },
      hint: 'Read the passage aloud with expression.'
    })
  );

  (SENTENCE_BUILDERS_BY_GRADE[gradeKey] || []).forEach((t) =>
    out.push({
      id: `g${gradeKey}-${t.suffix}`,
      grade: gradeKey,
      type: 'sentence_builder',
      difficulty: 'beginner',
      title: t.title,
      skills: ['writing', 'grammar'],
      content: { sentence: t.sentence },
      hint: 'Put the words in the right order.'
    })
  );

  (SPELLING_PACKS_BY_GRADE[gradeKey] || []).forEach((t) =>
    out.push({
      id: `g${gradeKey}-${t.suffix}`,
      grade: gradeKey,
      type: 'spelling',
      difficulty: 'intermediate',
      title: t.title,
      skills: ['spelling'],
      content: { words: t.words },
      hint: 'Spell each word carefully.'
    })
  );

  (DICTATION_PACKS_BY_GRADE[gradeKey] || []).forEach((t) =>
    out.push({
      id: `g${gradeKey}-${t.suffix}`,
      grade: gradeKey,
      type: 'dictation',
      difficulty: 'intermediate',
      title: t.title,
      skills: ['listening', 'writing'],
      content: { text: t.text },
      hint: t.hint
    })
  );

  return out;
}

function expandGrade(gradeKey) {
  const file = path.join(contentDir, gradeKey, 'index.json');
  if (!fs.existsSync(file)) return 0;
  const lessons = JSON.parse(fs.readFileSync(file, 'utf8'));
  const ids = new Set(lessons.map((l) => l.id));
  let added = 0;

  buildLessonsForGrade(gradeKey).forEach((lesson) => {
    if (ids.has(lesson.id)) return;
    lessons.push(lesson);
    ids.add(lesson.id);
    added++;
  });

  if (added) {
    fs.writeFileSync(file, JSON.stringify(lessons, null, 2));
  }
  return added;
}

const grades = ['preK', 'K', '1', '2', '3', '4', '5', '6'];
let totalAdded = 0;
let grandTotal = 0;

grades.forEach((g) => {
  const n = expandGrade(g);
  const file = path.join(contentDir, g, 'index.json');
  const count = JSON.parse(fs.readFileSync(file, 'utf8')).length;
  grandTotal += count;
  if (n) console.log(`Grade ${g}: +${n} lessons (${count} total)`);
  totalAdded += n;
});

console.log(`Added this run: ${totalAdded}`);
console.log(`Curriculum total: ${grandTotal}`);

if (grandTotal < TARGET_MIN) {
  console.warn(`Warning: ${grandTotal} lessons — still below target of ${TARGET_MIN}`);
  process.exitCode = 1;
} else {
  console.log(`Target met: ${grandTotal} >= ${TARGET_MIN} lessons`);
}
