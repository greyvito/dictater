import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'prek');
const lettersDir = path.join(outDir, 'letters');

/** @type {Record<string, { emoji: string, bg: string }>} */
const WORDS = {
  cat: { emoji: '🐱', bg: '#FFE082' },
  dog: { emoji: '🐶', bg: '#FFCCBC' },
  sun: { emoji: '☀️', bg: '#FFF59D' },
  ball: { emoji: '⚽', bg: '#B3E5FC' },
  hat: { emoji: '🎩', bg: '#E1BEE7' },
  fish: { emoji: '🐟', bg: '#B2EBF2' },
  tree: { emoji: '🌳', bg: '#C8E6C9' },
  book: { emoji: '📖', bg: '#D7CCC8' },
  apple: { emoji: '🍎', bg: '#FFCDD2' },
  bird: { emoji: '🐦', bg: '#BBDEFB' },
  car: { emoji: '🚗', bg: '#FFAB91' },
  star: { emoji: '⭐', bg: '#FFF176' },
  house: { emoji: '🏠', bg: '#FFCC80' },
  moon: { emoji: '🌙', bg: '#C5CAE9' },
  bed: { emoji: '🛏️', bg: '#E1BEE7' },
  cup: { emoji: '🥤', bg: '#F8BBD0' },
  pig: { emoji: '🐷', bg: '#F8BBD0' },
  hen: { emoji: '🐔', bg: '#FFE0B2' },
  bat: { emoji: '🦇', bg: '#CFD8DC' },
  bee: { emoji: '🐝', bg: '#FFF176' },
  butterfly: { emoji: '🦋', bg: '#F48FB1' },
  elephant: { emoji: '🐘', bg: '#B0BEC5' },
  flower: { emoji: '🌸', bg: '#F8BBD0' },
  snake: { emoji: '🐍', bg: '#A5D6A7' },
  tiger: { emoji: '🐯', bg: '#FFCC80' },
  goat: { emoji: '🐐', bg: '#D7CCC8' },
  jam: { emoji: '🍓', bg: '#EF9A9A' },
  kite: { emoji: '🪁', bg: '#81D4FA' },
  log: { emoji: '🪵', bg: '#BCAAA4' },
  map: { emoji: '🗺️', bg: '#90CAF9' },
  net: { emoji: '🥅', bg: '#B2DFDB' },
  pencil: { emoji: '✏️', bg: '#FFE082' },
  robot: { emoji: '🤖', bg: '#B0BEC5' },
  shoe: { emoji: '👟', bg: '#FFAB91' },
  sock: { emoji: '🧦', bg: '#CE93D8' },
  spoon: { emoji: '🥄', bg: '#E0E0E0' },
  watermelon: { emoji: '🍉', bg: '#EF9A9A' },
  egg: { emoji: '🥚', bg: '#FFF9C4' },
  fan: { emoji: '🌀', bg: '#80DEEA' },
  hand: { emoji: '✋', bg: '#FFCCBC' },
  heart: { emoji: '❤️', bg: '#F48FB1' },
  banana: { emoji: '🍌', bg: '#FFF176' },
  dish: { emoji: '🍽️', bg: '#E0E0E0' },
  friend: { emoji: '🤝', bg: '#F8BBD0' },
  happy: { emoji: '😊', bg: '#FFF59D' },
  sad: { emoji: '😢', bg: '#BBDEFB' },
  angry: { emoji: '😠', bg: '#FFAB91' },
  hot: { emoji: '🔥', bg: '#FF8A65' },
  blue: { emoji: '🔵', bg: '#90CAF9' },
  green: { emoji: '🟢', bg: '#A5D6A7' },
  red: { emoji: '🔴', bg: '#EF9A9A' },
  big: { emoji: '🐘', bg: '#B0BEC5' },
  small: { emoji: '🐭', bg: '#E1BEE7' },
  run: { emoji: '🏃', bg: '#80DEEA' },
  tall: { emoji: '🦒', bg: '#FFE082' },
  king: { emoji: '👑', bg: '#FFD54F' },
  ring: { emoji: '💍', bg: '#F8BBD0' },
  light: { emoji: '💡', bg: '#FFF176' },
  night: { emoji: '🌃', bg: '#7986CB' },
  day: { emoji: '🌤️', bg: '#81D4FA' },
  hello: { emoji: '👋', bg: '#FFCC80' },
  'thank-you': { emoji: '🙏', bg: '#C5E1A5' },
  one: { emoji: '1️⃣', bg: '#FFAB91' },
  two: { emoji: '2️⃣', bg: '#CE93D8' },
  three: { emoji: '3️⃣', bg: '#80CBC4' },
  hippopotamus: { emoji: '🦛', bg: '#B0BEC5' }
};

const LETTER_COLORS = [
  '#FF6B6B', '#FF8E72', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF',
  '#FF85A1', '#5EBAD6', '#FFB347', '#98D8AA'
];

function cardSvg(emoji, bg, label = '') {
  const safeLabel = label.replace(/[<>&"]/g, '');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img"${safeLabel ? ` aria-label="${safeLabel}"` : ''}>
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg};stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.35"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#g)" stroke="rgba(0,0,0,0.08)" stroke-width="2"/>
  <circle cx="60" cy="60" r="46" fill="rgba(255,255,255,0.45)"/>
  <text x="60" y="74" font-size="52" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
</svg>`;
}

function letterSvg(letter, bg) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Letter ${letter.toUpperCase()}">
  <rect width="120" height="120" rx="28" fill="${bg}"/>
  <circle cx="60" cy="60" r="44" fill="rgba(255,255,255,0.55)"/>
  <text x="60" y="78" font-size="64" font-weight="bold" font-family="DM Sans, Arial, sans-serif" fill="#2D3748" text-anchor="middle">${letter.toUpperCase()}</text>
</svg>`;
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(lettersDir, { recursive: true });

let count = 0;
for (const [word, { emoji, bg }] of Object.entries(WORDS)) {
  const file = path.join(outDir, `${word}.svg`);
  fs.writeFileSync(file, cardSvg(emoji, bg, word));
  count++;
}

for (let i = 0; i < 26; i++) {
  const letter = String.fromCharCode(97 + i);
  fs.writeFileSync(
    path.join(lettersDir, `${letter}.svg`),
    letterSvg(letter, LETTER_COLORS[i % LETTER_COLORS.length])
  );
  count++;
}

console.log(`Generated ${count} PreK SVG illustrations in public/images/prek/`);
