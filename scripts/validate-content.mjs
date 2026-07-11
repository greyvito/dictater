import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateLesson, ACTIVITY_TYPES } from '../src/curriculum/schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, '..', 'content');

let errors = 0;
let count = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.json') validateFile(full);
  }
}

function validateFile(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const lessons = Array.isArray(raw) ? raw : [raw];
  lessons.forEach((lesson) => {
    count++;
    const errs = validateLesson(lesson);
    if (errs.length) {
      console.error(`${filePath} [${lesson.id}]:`, errs.join(', '));
      errors++;
    }
    if (lesson.type && !ACTIVITY_TYPES.includes(lesson.type)) {
      console.error(`${filePath} [${lesson.id}]: unknown type ${lesson.type}`);
      errors++;
    }
  });
}

walk(contentDir);
console.log(`Validated ${count} lessons, ${errors} error(s)`);
if (errors > 0) process.exit(1);
