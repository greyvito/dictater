import { describe, it, expect } from 'vitest';
import { validateLesson, ACTIVITY_TYPES, skillAreaForType } from '../src/curriculum/schema.js';
import { imagePathForWord } from '../src/prek/images.js';
import prekContent from '../content/preK/index.json';

describe('word_intro curriculum', () => {
  it('registers word_intro activity type', () => {
    expect(ACTIVITY_TYPES).toContain('word_intro');
    expect(skillAreaForType('word_intro')).toBe('vocabulary');
  });

  it('has topical intro lessons in PreK', () => {
    const intros = prekContent.filter((l) => l.type === 'word_intro');
    expect(intros.length).toBe(17);
    intros.forEach((lesson) => {
      expect(validateLesson(lesson)).toEqual([]);
      expect(lesson.content.words.length).toBeGreaterThan(4);
      expect(lesson.content.practiceLessonId).toBeTruthy();
      expect(lesson.topic).toBeTruthy();
    });
  });

  it('illustrates all words in intro lessons', () => {
    const intros = prekContent.filter((l) => l.type === 'word_intro');
    const missing = [];
    intros.forEach((lesson) => {
      lesson.content.words.forEach((word) => {
        if (!imagePathForWord(word)) missing.push(`${lesson.id}:${word}`);
      });
    });
    expect(missing).toEqual([]);
  });
});
