import { recordAudio, recordDurationForMode } from './record.js';
import { splitIntoWords, stripFillerWords, alignWords, scoreAlignment } from '../grading/wordDiff.js';

let cachedStatus = null;
let statusCheckedAt = 0;
const STATUS_TTL_MS = 30000;

/** @returns {Promise<{ available: boolean, engine: string, model?: string }>} */
export async function fetchWhisperStatus() {
  const now = Date.now();
  if (cachedStatus && now - statusCheckedAt < STATUS_TTL_MS) return cachedStatus;
  try {
    const res = await fetch('/api/speech/status', { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('status failed');
    cachedStatus = await res.json();
  } catch {
    cachedStatus = { available: false, engine: 'browser' };
  }
  statusCheckedAt = now;
  return cachedStatus;
}

/** @returns {Promise<boolean>} */
export async function isWhisperAvailable() {
  const s = await fetchWhisperStatus();
  return !!s.available;
}

/**
 * @param {Blob} audio
 * @param {{ prompt?: string, language?: string }} [options]
 */
export async function transcribeAudio(audio, options = {}) {
  const form = new FormData();
  form.append('audio', audio, 'speech.webm');
  if (options.prompt) form.append('prompt', options.prompt);
  if (options.language) form.append('language', options.language);

  const res = await fetch('/api/speech/transcribe', {
    method: 'POST',
    body: form
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Whisper transcription failed');
  }
  const data = await res.json();
  return data.text || '';
}

/**
 * Pick best transcript when we have expected hint (same logic as Web STT).
 * @param {string} text
 * @param {string} expectedHint
 */
export function refineTranscript(text, expectedHint) {
  if (!expectedHint) return text;
  const expectedWords = splitIntoWords(expectedHint);
  const spoken = stripFillerWords(splitIntoWords(text));
  const alignment = alignWords(expectedWords, spoken, { fuzzy: true, childMode: true });
  const score = scoreAlignment(alignment, expectedWords.length);
  return score >= 50 ? text : text;
}

/**
 * Record + transcribe with local Whisper.
 * @param {{ expectedHint?: string, mode?: string, language?: string }} options
 */
export async function listenWithWhisper(options = {}) {
  const { expectedHint = '', mode = 'sentence', language = 'en' } = options;
  const ms = recordDurationForMode(mode);
  const blob = await recordAudio(ms);
  const text = await transcribeAudio(blob, { prompt: expectedHint, language });
  if (!text) throw new Error('No speech detected — try speaking louder');
  return refineTranscript(text, expectedHint);
}

export function clearWhisperStatusCache() {
  cachedStatus = null;
  statusCheckedAt = 0;
}
