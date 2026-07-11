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
  rec.maxAlternatives = 3;
  return rec;
}

/** @returns {Promise<string>} */
export function listenOnce(options = {}) {
  const { continuous = false, lang = 'en-US', timeoutMs = 8000 } = options;
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
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ')
        .trim();
      resolve(transcript);
    };

    rec.onerror = (event) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      reject(new Error(event.error || 'Recognition failed'));
    };

    rec.onend = () => {
      if (!finished) {
        finished = true;
        clearTimeout(timer);
        reject(new Error('No speech detected'));
      }
    };

    rec.start();
  });
}

export function scoreSpeech(expectedText, transcript, options = {}) {
  const {
    fuzzy = true,
    alternatives = [],
    stripFillers = true,
    mode = 'sentence'
  } = options;

  let expectedWords = splitIntoWords(expectedText);
  let spokenWords = splitIntoWords(transcript);
  if (stripFillers) spokenWords = stripFillerWords(spokenWords);

  if (mode === 'word') {
    const match = spokenWords.some((w) =>
      alignWords([expectedWords[0] || expectedText], [w], { fuzzy, alternatives }).some(
        (a) => a.status === 'correct'
      )
    );
    return {
      score: match ? 100 : 0,
      passed: match,
      alignment: alignWords(expectedWords.slice(0, 1), spokenWords.slice(0, 1), {
        fuzzy,
        alternatives
      }),
      transcript
    };
  }

  const alignment = alignWords(expectedWords, spokenWords, { fuzzy, alternatives });
  const score = scoreAlignment(alignment, expectedWords.length);
  const passThreshold = mode === 'passage' ? 75 : 80;
  return {
    score,
    passed: score >= passThreshold,
    alignment,
    transcript,
    correctCount: alignment.filter((a) => a.status === 'correct').length,
    totalCount: expectedWords.length
  };
}
