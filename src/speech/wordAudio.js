import { normalizeWord } from '../prek/images.js';

const AUDIO_BASE = '/audio/words';

/** @param {string} word */
export function audioSlugForWord(word) {
  const key = normalizeWord(word);
  if (!key) return '';
  return key.replace(/\s+/g, '-');
}

/** @param {string} word */
export function audioPathForWord(word) {
  const slug = audioSlugForWord(word);
  return slug ? `${AUDIO_BASE}/${slug}.wav` : '';
}

/** @type {Set<string>|null} */
let cachedManifest = null;

async function loadManifest() {
  if (cachedManifest) return cachedManifest;
  try {
    const res = await fetch(`${AUDIO_BASE}/manifest.json`);
    if (!res.ok) return null;
    const data = await res.json();
    cachedManifest = new Set(Array.isArray(data.words) ? data.words : []);
    return cachedManifest;
  } catch {
    return null;
  }
}

/** @param {string} word */
export async function hasCachedWordAudio(word) {
  const slug = audioSlugForWord(word);
  if (!slug) return false;
  const manifest = await loadManifest();
  if (manifest) return manifest.has(slug);
  return Boolean(audioPathForWord(word));
}

/**
 * Play pre-generated word audio when available.
 * @param {string} word
 * @returns {Promise<boolean>} true if cached audio played
 */
export async function playWordAudio(word) {
  const path = audioPathForWord(word);
  if (!path) return false;

  const manifest = await loadManifest();
  const slug = audioSlugForWord(word);
  if (manifest && !manifest.has(slug)) return false;

  return new Promise((resolve) => {
    const audio = new Audio(path);
    audio.onended = () => resolve(true);
    audio.onerror = () => resolve(false);
    audio.play().catch(() => resolve(false));
  });
}
