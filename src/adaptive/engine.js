import { getLessonsForGrade } from '../curriculum/loader.js';
import { skillAreaForType, isEarlyGrade } from '../curriculum/schema.js';

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
  let lessons = getLessonsForGrade(grade).filter((l) => !completedIds.has(l.id));
  if (!lessons.length) return null;

  // Early grades (PreK/K): pre-readers, so keep them on vocabulary when possible.
  if (isEarlyGrade(grade)) {
    const vocab = lessons.filter((l) => skillAreaForType(l.type) === 'vocabulary');
    if (vocab.length) lessons = vocab;
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
