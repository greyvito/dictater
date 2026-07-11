import { describe, it, expect } from 'vitest';
import {
  alignWords,
  scoreAlignment,
  splitIntoWords,
  wordsMatch,
  levenshtein
} from '../src/grading/wordDiff.js';
import { scoreSpeech } from '../src/speech/stt.js';
import { validateLesson } from '../src/curriculum/schema.js';
import { recordSkillResult, recommendNextLesson } from '../src/adaptive/engine.js';

describe('wordDiff', () => {
  it('aligns identical sentences', () => {
    const a = splitIntoWords('The cat sat.');
    const b = splitIntoWords('The cat sat.');
    const alignment = alignWords(a, b);
    expect(alignment.every((x) => x.status === 'correct')).toBe(true);
    expect(scoreAlignment(alignment, a.length)).toBe(100);
  });

  it('detects missing words', () => {
    const alignment = alignWords(['hello', 'world'], ['hello']);
    expect(alignment.some((x) => x.status === 'missing')).toBe(true);
  });

  it('fuzzy matches short words', () => {
    expect(wordsMatch('cat', 'ca', { fuzzy: true })).toBe(true);
  });

  it('computes levenshtein distance', () => {
    expect(levenshtein('cat', 'bat')).toBe(1);
  });
});

describe('scoreSpeech', () => {
  it('scores exact word match', () => {
    const result = scoreSpeech('hello', 'hello', { mode: 'word' });
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it('scores sentence with partial match', () => {
    const result = scoreSpeech('I like cats', 'I like dogs', { mode: 'sentence' });
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(100);
  });
});

describe('curriculum schema', () => {
  it('validates a good lesson', () => {
    const errors = validateLesson({
      id: 'test-1',
      grade: 'preK',
      type: 'phonological_rhyme',
      title: 'Test',
      content: { prompt: 'cat', choices: ['hat'], correctIndex: 0 }
    });
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid lesson', () => {
    const errors = validateLesson({ title: 'x' });
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('adaptive engine', () => {
  it('records skill mastery', () => {
    const lesson = { skills: ['speaking'], type: 'speak_word' };
    const mastery = recordSkillResult({}, lesson, 80);
    expect(mastery.speaking.avg).toBe(80);
  });
});
