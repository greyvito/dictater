import { TOPIC_UNITS } from '../../scripts/prek-topics.mjs';

/** Lesson types counted toward topical unit progress. */
export const UNIT_VOCAB_TYPES = new Set([
  'word_intro',
  'picture_vocab',
  'speak_repeat',
  'speak_sentence'
]);

/** @typedef {{ id: string, order: number, label: string, completed: number, total: number, pct: number }} UnitProgressRow */

const REVIEW_UNIT = { id: 'review', order: 99, label: 'Review Mix' };

/** @returns {Array<{ id: string, order: number, label: string }>} */
export function getUnitCatalog() {
  return [
    ...TOPIC_UNITS.map(({ id, order, label }) => ({ id, order, label })),
    { ...REVIEW_UNIT }
  ].sort((a, b) => a.order - b.order);
}

/**
 * @param {import('../activities/registry.js').Lesson[]} lessons — vocabulary lessons for one grade
 * @param {Set<string> | string[]} completedIds
 * @returns {UnitProgressRow[]}
 */
export function buildUnitProgressRows(lessons, completedIds) {
  const completed = completedIds instanceof Set ? completedIds : new Set(completedIds);
  const byTopic = new Map();

  lessons.forEach((lesson) => {
    if (!lesson.topic || !UNIT_VOCAB_TYPES.has(lesson.type)) return;
    if (!byTopic.has(lesson.topic)) byTopic.set(lesson.topic, []);
    byTopic.get(lesson.topic).push(lesson);
  });

  return getUnitCatalog().map((unit) => {
    const topicLessons = byTopic.get(unit.id) || [];
    const total = topicLessons.length;
    const done = topicLessons.filter((l) => completed.has(l.id)).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { ...unit, completed: done, total, pct };
  });
}

/**
 * @param {UnitProgressRow[]} rows
 */
export function summarizeUnitProgress(rows) {
  const completed = rows.reduce((sum, row) => sum + row.completed, 0);
  const total = rows.reduce((sum, row) => sum + row.total, 0);
  const pct = total ? Math.round((completed / total) * 100) : 0;
  return { completed, total, pct };
}
