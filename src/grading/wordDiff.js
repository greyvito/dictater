/** @typedef {{ original: string|null, typed: string|null, status: 'correct'|'incorrect'|'missing' }} AlignmentItem */

export function splitIntoWords(text) {
  return (text.match(/[\w'-]+/g) || []).filter((w) => w.replace(/['-]/g, '').length > 0);
}

export function normalizeWord(word) {
  return word.replace(/[.,!?;()]/g, '').toLowerCase().trim();
}

const FILLER_WORDS = new Set(['um', 'uh', 'er', 'ah']);

export function stripFillerWords(words) {
  return words.filter((w) => !FILLER_WORDS.has(normalizeWord(w)));
}

export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export function wordsMatch(expected, spoken, options = {}) {
  const { fuzzy = false, alternatives = [] } = options;
  const e = normalizeWord(expected);
  const s = normalizeWord(spoken);
  if (e === s) return true;
  if (alternatives.some((alt) => normalizeWord(alt) === s)) return true;
  if (fuzzy && e.length <= 4 && levenshtein(e, s) <= 1) return true;
  return false;
}

/** @returns {AlignmentItem[]} */
export function alignWords(origList, typedList, options = {}) {
  const m = origList.length;
  const n = typedList.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (wordsMatch(origList[i - 1], typedList[j - 1], options)) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let i = m;
  let j = n;
  /** @type {AlignmentItem[]} */
  const alignment = [];

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      wordsMatch(origList[i - 1], typedList[j - 1], options)
    ) {
      alignment.unshift({
        original: origList[i - 1],
        typed: typedList[j - 1],
        status: 'correct'
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      alignment.unshift({
        original: null,
        typed: typedList[j - 1],
        status: 'incorrect'
      });
      j--;
    } else {
      alignment.unshift({
        original: origList[i - 1],
        typed: null,
        status: 'missing'
      });
      i--;
    }
  }

  return alignment;
}

export function scoreAlignment(alignment, expectedCount) {
  const correctCount = alignment.filter((item) => item.status === 'correct').length;
  const total = expectedCount || alignment.filter((item) => item.original).length || 1;
  return Math.round((correctCount / total) * 100);
}

export function renderDiffToContainer(container, alignment) {
  container.innerHTML = '';
  alignment.forEach((item) => {
    const span = document.createElement('span');
    span.className = 'diff-word';
    if (item.status === 'correct') {
      span.classList.add('correct');
      span.textContent = item.original;
    } else if (item.status === 'incorrect') {
      span.classList.add('incorrect');
      span.textContent = item.typed;
      span.title = 'Extra or incorrect word';
    } else {
      span.classList.add('missing');
      span.textContent = item.original;
      span.title = 'Missing word';
    }
    container.appendChild(span);
  });
}
