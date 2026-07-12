import { describe, it, expect, vi } from 'vitest';
import { shuffleWithCorrectIndex } from '../src/prek/shuffle.js';

describe('shuffleWithCorrectIndex', () => {
  it('preserves all choices and maps correct index', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const { choices, correctIndex } = shuffleWithCorrectIndex(['a', 'b', 'c'], 1);
    expect(choices.sort()).toEqual(['a', 'b', 'c']);
    expect(choices[correctIndex]).toBe('b');
    Math.random.mockRestore();
  });

  it('keeps correct answer when already first', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { choices, correctIndex } = shuffleWithCorrectIndex(['x', 'y', 'z'], 0);
    expect(choices[correctIndex]).toBe('x');
    Math.random.mockRestore();
  });
});
