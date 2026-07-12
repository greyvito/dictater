import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateLesson, ACTIVITY_TYPES, GRADES } from '../src/curriculum/schema.js';
import { imagePathForWord } from '../src/prek/images.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', 'content');
const prekImgDir = path.join(__dirname, '..', 'public', 'images', 'prek');

const stats = {
  total: 0,
  byGrade: {},
  byType: {},
  errors: [],
  warnings: []
};

function bump(map, key) {
  map[key] = (map[key] || 0) + 1;
}

function walkPrekWords(lesson) {
  if (lesson.grade !== 'preK' && lesson.grade !== 'K') return;
  const c = lesson.content || {};
  const words = [];
  if (c.prompt) words.push(c.prompt);
  if (c.expectedText) words.push(c.expectedText);
  if (c.letter) words.push(c.letter);
  if (Array.isArray(c.words)) words.push(...c.words);
  if (Array.isArray(c.choices)) words.push(...c.choices);
  words.filter(Boolean).forEach((w) => {
    const s = String(w).replace(/^\/([a-z]+)\/$/, '$1').toLowerCase();
    if (s.length > 1 && !imagePathForWord(s)) {
      stats.warnings.push(`${lesson.grade} lesson ${lesson.id}: no illustration for "${s}"`);
    }
  });
}

function qaFile(filePath) {
  const grade = path.basename(path.dirname(filePath));
  const lessons = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const ids = new Set();

  lessons.forEach((lesson) => {
    stats.total++;
    bump(stats.byGrade, lesson.grade || grade);
    bump(stats.byType, lesson.type);

    validateLesson(lesson).forEach((e) => stats.errors.push(`${lesson.id}: ${e}`));
    if (!ACTIVITY_TYPES.includes(lesson.type)) {
      stats.errors.push(`${lesson.id}: unknown type ${lesson.type}`);
    }
    if (!GRADES.includes(lesson.grade)) {
      stats.warnings.push(`${lesson.id}: unusual grade ${lesson.grade}`);
    }
    if (ids.has(lesson.id)) stats.errors.push(`duplicate id ${lesson.id} in ${grade}`);
    ids.add(lesson.id);

    if (lesson.type === 'comprehension' && !lesson.content?.passage) {
      stats.errors.push(`${lesson.id}: comprehension missing passage`);
    }
    if (['speak_word', 'speak_sentence', 'speak_repeat'].includes(lesson.type)) {
      const hasTarget =
        lesson.content?.words?.length ||
        lesson.content?.sentences?.length ||
        lesson.content?.expectedText ||
        lesson.content?.prompt;
      if (!hasTarget) stats.errors.push(`${lesson.id}: speaking lesson missing target text`);
    }
    if (lesson.type === 'word_intro' && !lesson.content?.words?.length) {
      stats.errors.push(`${lesson.id}: word_intro missing words array`);
    }

    walkPrekWords(lesson);
  });
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.json') qaFile(full);
  }
}

walk(contentDir);

const imgCount = fs.existsSync(prekImgDir)
  ? fs.readdirSync(prekImgDir).filter((f) => f.endsWith('.svg')).length
  : 0;

console.log('=== Dictater Content QA ===');
console.log(`Lessons: ${stats.total}`);
console.log(`PreK SVG pack: ${imgCount} files in public/images/prek/`);
console.log('');
console.log('By grade:', stats.byGrade);
console.log('');
console.log(`Errors: ${stats.errors.length}`);
stats.errors.slice(0, 20).forEach((e) => console.error('  ✗', e));
if (stats.errors.length > 20) console.error(`  … and ${stats.errors.length - 20} more`);

console.log('');
console.log(`Warnings: ${stats.warnings.length}`);
stats.warnings.slice(0, 15).forEach((w) => console.warn('  ⚠', w));
if (stats.warnings.length > 15) console.warn(`  … and ${stats.warnings.length - 15} more`);

if (stats.errors.length) process.exit(1);
console.log('\nQA passed.');
