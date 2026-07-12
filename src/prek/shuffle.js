/**
 * Fisher–Yates shuffle of choice indices; returns new order and displayed correct index.
 * @param {unknown[]} choices
 * @param {number} correctIndex
 * @returns {{ choices: unknown[], correctIndex: number }}
 */
export function shuffleWithCorrectIndex(choices, correctIndex) {
  const items = [...choices];
  const indices = items.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffled = indices.map((i) => items[i]);
  const newCorrectIndex = indices.indexOf(correctIndex);
  return { choices: shuffled, correctIndex: newCorrectIndex };
}
