import { describe, it, expect } from 'vitest';
import {
  buildUnitProgressRows,
  getUnitCatalog,
  summarizeUnitProgress,
  UNIT_VOCAB_TYPES
} from '../src/curriculum/unitProgress.js';
import prekContent from '../content/preK/index.json';
import kContent from '../content/K/index.json';

function vocabTopicLessons(content) {
  return content.filter((l) => l.topic && UNIT_VOCAB_TYPES.has(l.type));
}

describe('unit progress', () => {
  it('lists topical units including review', () => {
    const catalog = getUnitCatalog();
    expect(catalog).toHaveLength(18);
    expect(catalog[0].id).toBe('hello-manners');
    expect(catalog[catalog.length - 1].id).toBe('review');
    expect(catalog[catalog.length - 1].order).toBe(99);
  });

  it('counts PreK lessons per unit (intro + quiz + speak)', () => {
    const rows = buildUnitProgressRows(vocabTopicLessons(prekContent), new Set());
    expect(rows).toHaveLength(18);
    rows.filter((r) => r.id !== 'review').forEach((row) => {
      expect(row.total).toBe(4);
      expect(row.completed).toBe(0);
      expect(row.pct).toBe(0);
    });
    const review = rows.find((r) => r.id === 'review');
    expect(review?.total).toBe(3);
  });

  it('counts K topical lessons the same shape as PreK', () => {
    const rows = buildUnitProgressRows(vocabTopicLessons(kContent), new Set());
    expect(rows).toHaveLength(18);
    expect(rows.reduce((sum, r) => sum + r.total, 0)).toBe(71);
  });

  it('tracks completed lesson ids per topic', () => {
    const lessons = vocabTopicLessons(prekContent);
    const colorsIntro = lessons.find((l) => l.id === 'preK-intro-colors');
    const colorsQuiz = lessons.find((l) => l.id === 'preK-pic-colors-1');
    const completed = new Set([colorsIntro.id, colorsQuiz.id]);

    const rows = buildUnitProgressRows(lessons, completed);
    const colors = rows.find((r) => r.id === 'colors');
    expect(colors?.completed).toBe(2);
    expect(colors?.total).toBe(4);
    expect(colors?.pct).toBe(50);

    const summary = summarizeUnitProgress(rows);
    expect(summary.completed).toBe(2);
    expect(summary.total).toBe(71);
  });

  it('ignores non-unit vocabulary lessons without topic', () => {
    const lessons = [
      ...vocabTopicLessons(prekContent),
      { id: 'extra', grade: 'preK', type: 'word_intro', topic: null }
    ];
    const rows = buildUnitProgressRows(lessons, new Set());
    expect(rows.reduce((sum, r) => sum + r.total, 0)).toBe(71);
  });
});
