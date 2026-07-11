import { splitIntoWords, stripFillerWords, alignWords, scoreAlignment } from '../grading/wordDiff.js';

export function isSTTSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createRecognizer(lang = 'en-US') {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 5;
  return rec;
}

function pickBestTranscript(results, expectedHint = '') {
  const candidates = [];
  for (let i = 0; i < results.length; i++) {
    for (let j = 0; j < results[i].length; j++) {
      candidates.push(results[i][j].transcript.trim());
    }
  }
  if (!expectedHint) return candidates[0] || '';
  const expectedWords = splitIntoWords(expectedHint);
  let best = candidates[0] || '';
  let bestScore = -1;
  candidates.forEach((c) => {
    const spoken = stripFillerWords(splitIntoWords(c));
    const alignment = alignWords(expectedWords, spoken, { fuzzy: true, childMode: true });
    const score = scoreAlignment(alignment, expectedWords.length);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  });
  return best;
}

/** @returns {Promise<string>} */
export function listenOnce(options = {}) {
  const {
    continuous = false,
    lang = 'en-US',
    timeoutMs = 10000,
    expectedHint = ''
  } = options;

  return new Promise((resolve, reject) => {
    const rec = createRecognizer(lang);
    if (!rec) {
      reject(new Error('Speech recognition not supported in this browser'));
      return;
    }
    rec.continuous = continuous;
    let finished = false;
    const timer = setTimeout(() => {
      if (!finished) {
        finished = true;
        rec.stop();
        reject(new Error('Listening timed out — try again'));
      }
    }, timeoutMs);

    rec.onresult = (event) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve(pickBestTranscript(event.results, expectedHint));
    };

    rec.onerror = (event) => {
      if (finished) return;
      if (event.error === 'no-speech') return;
      finished = true;
      clearTimeout(timer);
      reject(new Error(event.error || 'Recognition failed'));
    };

    rec.onend = () => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        reject(new Error('No speech detected — try speaking louder'));
      }
    };

    rec.start();
  });
}

export function scoreSpeech(expectedText, transcript, options = {}) {
  const {
    fuzzy = true,
    childMode = true,
    alternatives = [],
    stripFillers = true,
    mode = 'sentence'
  } = options;

  let expectedWords = splitIntoWords(expectedText);
  let spokenWords = splitIntoWords(transcript);
  if (stripFillers) spokenWords = stripFillerWords(spokenWords);

  const matchOpts = { fuzzy, childMode, alternatives };

  if (mode === 'word') {
    const target = expectedWords[0] || expectedText;
    const match = spokenWords.some((w) =>
      alignWords([target], [w], matchOpts).some((a) => a.status === 'correct')
    );
    return {
      score: match ? 100 : 0,
      passed: match,
      alignment: alignWords([target], spokenWords.slice(0, 1), matchOpts),
      transcript
    };
  }

  const alignment = alignWords(expectedWords, spokenWords, matchOpts);
  const score = scoreAlignment(alignment, expectedWords.length);
  const passThreshold = mode === 'passage' ? 70 : 75;
  return {
    score,
    passed: score >= passThreshold,
    alignment,
    transcript,
    correctCount: alignment.filter((a) => a.status === 'correct').length,
    totalCount: expectedWords.length
  };
}
