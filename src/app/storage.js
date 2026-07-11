import Dexie from 'dexie';

export const MAX_STATS_RECORDS = 500;

export const db = new Dexie('DictaterDB');
db.version(1).stores({
  stats: 'id, date, exerciseId, type, score',
  skillMastery: 'skill, grade',
  contentCache: 'key',
  syncQueue: '++id, createdAt'
});

const DEFAULT_BADGES = {
  firstSteps: false,
  accuracyExpert: false,
  spellingHero: false,
  streakExplorer: false,
  superWriter: false,
  customScholar: false,
  speakingStarter: false,
  clearSpeaker: false,
  fluencyStar: false,
  readingExplorer: false,
  phonicsMaster: false
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadCustomLessons() {
  return readJSON('DICTATER_CUSTOM_LESSONS', []);
}

export function saveCustomLessons(lessons) {
  writeJSON('DICTATER_CUSTOM_LESSONS', lessons);
}

export function loadStats() {
  let stats = readJSON('DICTATER_STATS', []);
  if (stats.length > MAX_STATS_RECORDS) {
    stats = stats.slice(-MAX_STATS_RECORDS);
    writeJSON('DICTATER_STATS', stats);
  }
  return stats;
}

export function saveStats(stats) {
  const capped = stats.length > MAX_STATS_RECORDS ? stats.slice(-MAX_STATS_RECORDS) : stats;
  writeJSON('DICTATER_STATS', capped);
  return capped;
}

export function loadBadges() {
  return { ...DEFAULT_BADGES, ...readJSON('DICTATER_BADGES', {}) };
}

export function saveBadges(badges) {
  writeJSON('DICTATER_BADGES', badges);
}

export function loadProfile() {
  return readJSON('DICTATER_PROFILE', {
    grade: '3',
    track: 'native',
    displayName: 'Student',
    authToken: null,
    userId: null
  });
}

export function saveProfile(profile) {
  writeJSON('DICTATER_PROFILE', profile);
}

export function loadPlacementResults() {
  return readJSON('DICTATER_PLACEMENT', {});
}

export function savePlacementResults(results) {
  writeJSON('DICTATER_PLACEMENT', results);
}

export function loadSkillMastery() {
  return readJSON('DICTATER_SKILLS', {});
}

export function saveSkillMastery(skills) {
  writeJSON('DICTATER_SKILLS', skills);
}

export async function mirrorStatsToIndexedDB(record) {
  try {
    await db.stats.put(record);
  } catch (e) {
    console.warn('[Storage] IndexedDB mirror failed', e);
  }
}

export async function cacheContent(key, data) {
  await db.contentCache.put({ key, data, cachedAt: Date.now() });
}

export async function getCachedContent(key) {
  return db.contentCache.get(key);
}

export function calculateStreak(stats) {
  if (!stats.length) return 0;
  const dates = [...new Set(stats.map((r) => r.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const current = new Date(dates[i]);
    const prev = new Date(dates[i + 1]);
    const diffDays = Math.ceil(Math.abs(current - prev) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) streak++;
    else if (diffDays > 1) break;
  }
  return streak;
}
