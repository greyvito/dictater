import { describe, it, expect } from 'vitest';
import { recordDurationForMode } from '../src/speech/record.js';

describe('speech record', () => {
  it('uses shorter duration for single words', () => {
    expect(recordDurationForMode('word')).toBeLessThan(recordDurationForMode('sentence'));
    expect(recordDurationForMode('passage')).toBeGreaterThan(recordDurationForMode('sentence'));
  });
});
