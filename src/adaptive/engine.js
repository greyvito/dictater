import { getLessonsForGrade } from '../curriculum/loader.js';
import { skillAreaForType } from '../curriculum/schema.js';

const VOCAB_TOPIC_TYPES = new Set(['word_intro', 'picture_vocab', 'speak_repeat', 'speak_sentence']);
const VOCAB_TYPE_ORDER = { word_intro: 0, picture_vocab: 1, speak_repeat: 2, speak_sentence: 2 };

/** @param {import('../curriculum/loader.js').Lesson[]} lessons */
function recommendVocabTopicLesson(lessons) {
  const vocab = lessons.filter(
    (l) => (l.grade === 'preK' || l.grade === 'K') && l.topic && VOCAB_TOPIC_TYPES.has(l.type)
  );
  if (!vocab.length) return null;

  const byOrder = new Map();
  vocab.forEach((l) => {
    const order = l.topicOrder ?? 999;
    if (!byOrder.has(order)) byOrder.set(order, []);
    byOrder.get(order).push(l);
  });

  for (const order of [...byOrder.keys()].sort((a, b) => a - b)) {
    const sorted = byOrder.get(order).sort(
      (a, b) => (VOCAB_TYPE_ORDER[a.type] ?? 5) - (VOCAB_TYPE_ORDER[b.type] ?? 5)
    );
    if (sorted.length) return sorted[0];
  }
  return null;
}

export function buildPlacementTest(grade) {
  const lessons = getLessonsForGrade(grade);
  const bySkill = {};
  lessons.forEach((l) => {
    const skill = skillAreaForType(l.type);
    if (!bySkill[skill]) bySkill[skill] = [];
    bySkill[skill].push(l);
  });
  const selected = [];
  Object.values(bySkill).forEach((list) => {
    if (list.length) selected.push(list[0]);
  });
  return selected.slice(0, 10);
}

export function recordSkillResult(skillMastery, lesson, score) {
  const skills = lesson.skills?.length ? lesson.skills : [skillAreaForType(lesson.type)];
  skills.forEach((skill) => {
    if (!skillMastery[skill]) {
      skillMastery[skill] = { attempts: 0, totalScore: 0, avg: 0 };
    }
    skillMastery[skill].attempts++;
    skillMastery[skill].totalScore += score;
    skillMastery[skill].avg = Math.round(skillMastery[skill].totalScore / skillMastery[skill].attempts);
  });
  return skillMastery;
}

export function recommendNextLesson(grade, skillMastery, completedIds = new Set()) {
  const lessons = getLessonsForGrade(grade).filter((l) => !completedIds.has(l.id));
  if (!lessons.length) return null;

  if (grade === 'preK' || grade === 'K') {
    const vocabPick = recommendVocabTopicLesson(lessons);
    if (vocabPick) return vocabPick;
  }

  const skillAvgs = Object.entries(skillMastery).sort((a, b) => a[1].avg - b[1].avg);
  if (skillAvgs.length) {
    const weakest = skillAvgs[0][0];
    const match = lessons.find((l) => (l.skills || []).includes(weakest) || skillAreaForType(l.type) === weakest);
    if (match) return match;
  }
  return lessons[0];
}

export function summarizePlacement(results) {
  const skills = {};
  results.forEach((r) => {
    r.skills?.forEach((s) => {
      if (!skills[s]) skills[s] = [];
      skills[s].push(r.score);
    });
  });
  const summary = {};
  Object.entries(skills).forEach(([skill, scores]) => {
    summary[skill] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  });
  return summary;
}
