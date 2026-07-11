import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WORD_BG, wordCardSvg, letterSvg, LETTER_COLORS } from './prek-art.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'prek');
const lettersDir = path.join(outDir, 'letters');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(lettersDir, { recursive: true });

let count = 0;
for (const [word, bg] of Object.entries(WORD_BG)) {
  fs.writeFileSync(path.join(outDir, `${word}.svg`), wordCardSvg(word, bg, word));
  count++;
}

for (let i = 0; i < 26; i++) {
  const letter = String.fromCharCode(97 + i);
  fs.writeFileSync(path.join(lettersDir, `${letter}.svg`), letterSvg(letter, LETTER_COLORS[i % LETTER_COLORS.length]));
  count++;
}

console.log(`Generated ${count} PreK vector illustrations (${Object.keys(WORD_BG).length} words + 26 letters)`);
