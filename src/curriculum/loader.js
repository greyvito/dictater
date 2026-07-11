import { validateLesson, skillAreaForType } from './schema.js';

/** @type {Record<string, { passages?: unknown[], words?: unknown[], lessons?: unknown[] }>} */
let curriculumIndex = {};

/** Load legacy window curriculum from script tags (fallback) */
export function loadLegacyCurriculum() {
  if (typeof window !== 'undefined' && window.DICTATER_CURRICULUM) {
    return window.DICTATER_CURRICULUM;
  }
  return {};
}

/** Convert legacy grade object to unified lesson list */
export function legacyToLessons(gradeKey, gradeData) {
  /** @type {import('../activities/registry.js').Lesson[]} */
  const lessons = [];
  if (gradeData.passages) {
    gradeData.passages.forEach((p) => {
      lessons.push({
        id: p.id,
        grade: gradeKey,
        type: 'dictation',
        difficulty: p.difficulty || 'beginner',
        title: p.title,
        hint: p.hint || '',
        skills: ['listening', 'writing'],
        standards: [],
        content: { text: p.text }
      });
    });
  }
  if (gradeData.words) {
    gradeData.words.forEach((w) => {
      lessons.push({
        id: w.id,
        grade: gradeKey,
        type: 'spelling',
        difficulty: w.difficulty || 'beginner',
        title: w.title,
        hint: w.hint || '',
        skills: ['writing', 'spelling'],
        standards: [],
        content: { words: w.words }
      });
      lessons.push({
        id: w.id.replace('-w', '-sw').replace('g', 'g') + '-speak',
        grade: gradeKey,
        type: 'speak_word',
        difficulty: w.difficulty || 'beginner',
        title: `Speak: ${w.title}`,
        hint: w.hint || 'Say each word clearly after you hear it.',
        skills: ['speaking', 'oral_fluency'],
        standards: ['CCSS.ELA-LITERACY.SL.K.6'],
        content: {
          words: w.words,
          maxAttempts: 3,
          feedbackLevel: 'word'
        }
      });
    });
  }
  return lessons;
}

export async function loadJsonCurriculum() {
  const grades = ['preK', 'K', '1', '2', '3', '4', '5', '6'];
  /** @type {import('../activities/registry.js').Lesson[]} */
  const all = [];

  for (const grade of grades) {
    try {
      const mod = await import(`../../content/${grade}/index.json`);
      const lessons = mod.default || mod;
      if (Array.isArray(lessons)) {
        lessons.forEach((lesson) => {
          const errors = validateLesson(lesson);
          if (errors.length) {
            console.warn(`[Curriculum] ${lesson.id}:`, errors);
          } else {
            all.push(lesson);
          }
        });
      }
    } catch {
      // Grade bundle may not exist yet
    }
  }
  return all;
}

export async function buildCurriculumIndex() {
  /** @type {import('../activities/registry.js').Lesson[]} */
  let allLessons = await loadJsonCurriculum();

  const jsonGrades = new Set(allLessons.map((l) => l.grade));
  const legacy = loadLegacyCurriculum();
  Object.entries(legacy).forEach(([gradeKey, gradeData]) => {
    if (!jsonGrades.has(gradeKey)) {
      allLessons = allLessons.concat(legacyToLessons(gradeKey, gradeData));
    }
  });

  curriculumIndex = {};
  allLessons.forEach((lesson) => {
    if (!curriculumIndex[lesson.grade]) {
      curriculumIndex[lesson.grade] = { lessons: [] };
    }
    curriculumIndex[lesson.grade].lessons.push(lesson);
  });

  return curriculumIndex;
}

export function getLessonsForGrade(grade) {
  return curriculumIndex[grade]?.lessons || [];
}

export function getLessonsBySkill(grade, skillArea) {
  return getLessonsForGrade(grade).filter(
    (l) => skillAreaForType(l.type) === skillArea
  );
}

export function getLessonById(id) {
  for (const grade of Object.keys(curriculumIndex)) {
    const found = curriculumIndex[grade].lessons.find((l) => l.id === id);
    if (found) return found;
  }
  return null;
}

export function getCurriculumIndex() {
  return curriculumIndex;
}
