import { describe, it, expect } from 'vitest';
import {
  normalizeWord,
  imagePathForWord,
  emojiForWord,
  normalizeChoices,
  resolvePromptVisual
} from '../src/prek/images.js';

describe('prek images', () => {
  it('normalizes phoneme prompts', () => {
    expect(normalizeWord('/b/')).toBe('b');
    expect(normalizeWord('Thank You!')).toBe('thank you');
  });

  it('resolves letter and word SVG paths', () => {
    expect(imagePathForWord('cat')).toBe('/images/prek/cat.svg');
    expect(imagePathForWord('D')).toBe('/images/prek/letters/d.svg');
    expect(imagePathForWord('thank you')).toBe('/images/prek/thank-you.svg');
  });

  it('falls back to emoji for unknown words', () => {
    expect(emojiForWord('cat')).toBe('🐱');
    expect(emojiForWord('xyzunknown')).toBe('✨');
  });

  it('normalizes string choices with visuals', () => {
    const choices = normalizeChoices(['hat', 'dog', 'sun'], 0);
    expect(choices[0].label).toBe('hat');
    expect(choices[0].src).toContain('hat.svg');
    expect(choices[0].correct).toBe(true);
  });

  it('resolves prompt from letter field', () => {
    const vis = resolvePromptVisual({ letter: 'B' });
    expect(vis?.src).toBe('/images/prek/letters/b.svg');
  });
});
