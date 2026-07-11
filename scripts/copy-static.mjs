import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

const copyPairs = [
  ['curriculum', 'curriculum'],
  ['content', 'content'],
  ['images', 'images'],
  ['teacher.html', 'teacher.html'],
  ['sw.js', 'sw.js']
];

copyPairs.forEach(([src, dest]) => {
  const from = path.join(root, src);
  const to = path.join(dist, dest);
  if (!fs.existsSync(from)) return;
  if (fs.statSync(from).isDirectory()) {
    fs.cpSync(from, to, { recursive: true });
  } else {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
});

console.log('Copied static assets to dist/');
