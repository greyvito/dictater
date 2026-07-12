#!/usr/bin/env node
/**
 * Generate PreK/K topical vocabulary lessons from scripts/prek-topics.mjs
 * Usage: node scripts/generate-topic-lessons.mjs [--write]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOPIC_UNITS, wordsForGrade, buildPictureQuizzes, REVIEW_SETS } from './prek-topics.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const write = process.argv.includes('--write');

/** @param {string} grade @param {import('./prek-topics.mjs').TopicUnit} topic */
function lessonsForTopic(grade, topic) {
  const prefix = grade === 'preK' ? 'preK' : 'gK';
  const words = wordsForGrade(grade, topic);
  const introId = `${prefix}-intro-${topic.id}`;
  const quizBase = `${prefix}-pic-${topic.id}`;
  const speakId = `${prefix}-speak-${topic.id}`;
  const lessons = [];

  const firstQuizId = `${quizBase}-1`;
  lessons.push({
    id: introId,
    grade,
    type: 'word_intro',
    difficulty: 'beginner',
    title: `Learn: ${topic.label}`,
    topic: topic.id,
    topicOrder: topic.order,
    topicLabel: topic.label,
    skills: ['oral_vocabulary', 'listening'],
    standards: grade === 'preK' ? ['CCSS.ELA-LITERACY.RF.K.1'] : ['CCSS.ELA-LITERACY.RF.K.3'],
    content: {
      topic: topic.label,
      words,
      practiceLessonId: firstQuizId
    },
    hint: 'Tap Next to see and hear each new word.'
  });

  const quizzes = buildPictureQuizzes(words);
  quizzes.forEach((q, i) => {
    lessons.push({
      id: `${quizBase}-${i + 1}`,
      grade,
      type: 'picture_vocab',
      difficulty: 'beginner',
      title: `Quiz: ${topic.label}${quizzes.length > 1 ? ` (${i + 1})` : ''}`,
      topic: topic.id,
      topicOrder: topic.order,
      topicLabel: topic.label,
      skills: ['oral_vocabulary'],
      content: {
        prompt: q.prompt,
        choices: q.choices,
        correctIndex: q.correctIndex
      },
      hint: 'Tap the picture you hear.'
    });
  });

  if (grade === 'preK') {
    lessons.push({
      id: speakId,
      grade,
      type: 'speak_repeat',
      difficulty: 'beginner',
      title: `Say: ${topic.speakWord || words[0]}`,
      topic: topic.id,
      topicOrder: topic.order,
      topicLabel: topic.label,
      skills: ['speaking', 'oral_fluency'],
      content: {
        prompt: topic.speakWord || words[0],
        expectedText: topic.speakWord || words[0],
        maxAttempts: 2
      },
      hint: 'Repeat the word after you hear it.'
    });
  } else {
    lessons.push({
      id: speakId,
      grade,
      type: 'speak_sentence',
      difficulty: 'beginner',
      title: `Say: ${topic.label}`,
      topic: topic.id,
      topicOrder: topic.order,
      topicLabel: topic.label,
      skills: ['speaking', 'oral_fluency'],
      content: {
        sentences: [topic.kSentence || `I see a ${words[0]}.`],
        maxAttempts: 3
      },
      hint: 'Say the full sentence clearly.'
    });
  }

  return lessons;
}

function generateForGrade(grade) {
  /** @type {object[]} */
  const lessons = [];
  TOPIC_UNITS.forEach((topic) => {
    lessons.push(...lessonsForTopic(grade, topic));
  });

  const prefix = grade === 'preK' ? 'preK' : 'gK';
  const reviews = REVIEW_SETS[grade] || [];
  reviews.forEach((q, i) => {
    lessons.push({
      id: `${prefix}-review-${i + 1}`,
      grade,
      type: 'picture_vocab',
      difficulty: 'beginner',
      title: `Review Mix (${i + 1})`,
      topic: 'review',
      topicOrder: 99,
      topicLabel: 'Review Mix',
      skills: ['oral_vocabulary'],
      content: {
        prompt: q.prompt,
        choices: q.choices,
        correctIndex: q.correctIndex
      },
      hint: 'Tap the picture you hear.'
    });
  });

  return lessons;
}

const prekLessons = generateForGrade('preK');
const kLessons = generateForGrade('K');

console.log(`Generated ${prekLessons.length} PreK topical lessons`);
console.log(`Generated ${kLessons.length} K topical lessons`);

if (!write) {
  console.log('Dry run — pass --write to merge into content JSON files.');
  process.exit(0);
}

function mergeLessons(filePath, newLessons, removePatterns) {
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const topicIds = new Set(TOPIC_UNITS.map((t) => t.id));
  topicIds.add('review');
  const filtered = existing.filter((lesson) => {
    if (lesson.topic && topicIds.has(lesson.topic)) return false;
    if (removePatterns?.some((re) => re.test(lesson.id))) return false;
    return true;
  });
  const ids = new Set(filtered.map((l) => l.id));
  newLessons.forEach((l) => {
    if (!ids.has(l.id)) {
      filtered.push(l);
      ids.add(l.id);
    }
  });
  filtered.sort((a, b) => {
    const ao = a.topicOrder ?? 999;
    const bo = b.topicOrder ?? 999;
    if (ao !== bo) return ao - bo;
    const typeOrder = { word_intro: 0, picture_vocab: 1, speak_repeat: 2, speak_sentence: 2 };
    return (typeOrder[a.type] ?? 5) - (typeOrder[b.type] ?? 5);
  });
  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2));
  return filtered.length;
}

const prekPath = path.join(__dirname, '..', 'content', 'preK', 'index.json');
const kPath = path.join(__dirname, '..', 'content', 'K', 'index.json');

const grammarVocabRe = /^gpreK-(gram|vocab)/;
const prekCount = mergeLessons(prekPath, prekLessons, [grammarVocabRe, /^preK-vocab-0/, /^preK-pic-p800/]);
const kCount = mergeLessons(kPath, kLessons, [/^gK-pic-topic/]);

console.log(`Wrote ${prekCount} PreK lessons to content/preK/index.json`);
console.log(`Wrote ${kCount} K lessons to content/K/index.json`);
