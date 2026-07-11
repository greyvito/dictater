/** Custom child-friendly vector art for PreK word cards (no emoji). */

/** @type {Record<string, string>} */
export const WORD_BG = {
  cat: '#FFE082', dog: '#FFCCBC', sun: '#FFF59D', ball: '#B3E5FC', hat: '#E1BEE7',
  fish: '#B2EBF2', tree: '#C8E6C9', book: '#D7CCC8', apple: '#FFCDD2', bird: '#BBDEFB',
  car: '#FFAB91', star: '#FFF176', house: '#FFCC80', moon: '#C5CAE9', bed: '#E1BEE7',
  cup: '#F8BBD0', pig: '#F8BBD0', hen: '#FFE0B2', bat: '#CFD8DC', bee: '#FFF176',
  butterfly: '#F48FB1', elephant: '#B0BEC5', flower: '#F8BBD0', snake: '#A5D6A7',
  tiger: '#FFCC80', goat: '#D7CCC8', jam: '#EF9A9A', kite: '#81D4FA', log: '#BCAAA4',
  map: '#90CAF9', net: '#B2DFDB', pencil: '#FFE082', robot: '#B0BEC5', shoe: '#FFAB91',
  sock: '#CE93D8', spoon: '#E0E0E0', watermelon: '#EF9A9A', egg: '#FFF9C4', fan: '#80DEEA',
  hand: '#FFCCBC', heart: '#F48FB1', banana: '#FFF176', dish: '#E0E0E0', friend: '#F8BBD0',
  happy: '#FFF59D', sad: '#BBDEFB', angry: '#FFAB91', hot: '#FF8A65', blue: '#90CAF9',
  green: '#A5D6A7', red: '#EF9A9A', big: '#B0BEC5', small: '#E1BEE7', run: '#80DEEA',
  tall: '#FFE082', king: '#FFD54F', ring: '#F8BBD0', light: '#FFF176', night: '#7986CB',
  day: '#81D4FA', hello: '#FFCC80', 'thank-you': '#C5E1A5', one: '#FFAB91', two: '#CE93D8',
  three: '#80CBC4', hippopotamus: '#B0BEC5', tiny: '#E1BEE7'
};

/** @type {Record<string, string>} SVG group content, viewBox inner 20-100 */
export const WORD_ART = {
  cat: `<ellipse cx="60" cy="62" rx="28" ry="24" fill="#FF9F43"/><polygon points="35,42 42,22 50,40" fill="#FF9F43"/><polygon points="70,40 78,22 85,42" fill="#FF9F43"/><circle cx="50" cy="58" r="4" fill="#2D3748"/><circle cx="70" cy="58" r="4" fill="#2D3748"/><path d="M44 68 Q60 78 76 68" stroke="#2D3748" stroke-width="2" fill="none"/><line x1="38" y1="64" x2="22" y2="60" stroke="#2D3748" stroke-width="2"/><line x1="38" y1="70" x2="22" y2="72" stroke="#2D3748" stroke-width="2"/>`,
  dog: `<ellipse cx="60" cy="65" rx="30" ry="26" fill="#C68642"/><ellipse cx="38" cy="48" rx="12" ry="18" fill="#A66E2E"/><ellipse cx="82" cy="48" rx="12" ry="18" fill="#A66E2E"/><circle cx="48" cy="60" r="4" fill="#2D3748"/><circle cx="72" cy="60" r="4" fill="#2D3748"/><ellipse cx="60" cy="72" rx="8" ry="6" fill="#FAD390"/><path d="M52 76 Q60 82 68 76" stroke="#2D3748" stroke-width="2" fill="none"/>`,
  sun: `<circle cx="60" cy="60" r="22" fill="#FFD93D"/><g stroke="#FFB347" stroke-width="4" stroke-linecap="round"><line x1="60" y1="20" x2="60" y2="32"/><line x1="60" y1="88" x2="60" y2="100"/><line x1="20" y1="60" x2="32" y2="60"/><line x1="88" y1="60" x2="100" y2="60"/><line x1="32" y1="32" x2="40" y2="40"/><line x1="80" y1="80" x2="88" y2="88"/><line x1="80" y1="40" x2="88" y2="32"/><line x1="32" y1="88" x2="40" y2="80"/></g>`,
  ball: `<circle cx="60" cy="62" r="28" fill="#4D96FF"/><path d="M32 62 Q60 34 88 62" stroke="#fff" stroke-width="3" fill="none"/><path d="M32 62 Q60 90 88 62" stroke="#fff" stroke-width="3" fill="none"/>`,
  fish: `<ellipse cx="55" cy="62" rx="26" ry="18" fill="#4ECDC4"/><polygon points="82,62 98,48 98,76" fill="#4ECDC4"/><circle cx="44" cy="58" r="4" fill="#2D3748"/><path d="M38 68 Q55 74 72 68" stroke="#26A69A" stroke-width="2" fill="none"/>`,
  tree: `<rect x="52" y="58" width="16" height="32" fill="#8D6E63" rx="2"/><circle cx="60" cy="48" r="28" fill="#6BCB77"/><circle cx="42" cy="56" r="16" fill="#98D8AA"/><circle cx="78" cy="56" r="16" fill="#98D8AA"/>`,
  apple: `<circle cx="60" cy="65" r="26" fill="#FF6B6B"/><ellipse cx="60" cy="42" rx="4" ry="8" fill="#6BCB77"/><path d="M60 38 Q68 32 72 36" stroke="#8D6E63" stroke-width="2" fill="none"/><ellipse cx="52" cy="58" rx="6" ry="10" fill="#FF8787" opacity="0.5"/>`,
  bird: `<ellipse cx="58" cy="62" rx="22" ry="16" fill="#74B9FF"/><circle cx="72" cy="56" r="10" fill="#74B9FF"/><polygon points="82,56 92,52 82,60" fill="#FFB347"/><circle cx="76" cy="54" r="2.5" fill="#2D3748"/><path d="M48 68 Q58 76 68 68" stroke="#0984E3" stroke-width="2" fill="none"/>`,
  car: `<rect x="28" y="52" width="64" height="24" rx="8" fill="#FF6B6B"/><path d="M38 52 L48 36 H72 L82 52 Z" fill="#FF8787"/><circle cx="42" cy="78" r="10" fill="#2D3748"/><circle cx="78" cy="78" r="10" fill="#2D3748"/><circle cx="42" cy="78" r="4" fill="#B2BEC3"/><circle cx="78" cy="78" r="4" fill="#B2BEC3"/>`,
  house: `<polygon points="60,28 92,52 92,92 28,92 28,52" fill="#FFCC80"/><polygon points="60,22 98,52 22,52" fill="#FF6B6B"/><rect x="48" y="62" width="24" height="30" fill="#8D6E63"/><circle cx="78" cy="68" r="8" fill="#FFE082"/>`,
  star: `<polygon points="60,22 68,46 94,46 73,60 81,86 60,72 39,86 47,60 26,46 52,46" fill="#FFD93D" stroke="#FFB347" stroke-width="2"/>`,
  moon: `<path d="M70 28 A30 30 0 1 0 70 92 A22 22 0 1 1 70 28" fill="#FFE082"/>`,
  pig: `<ellipse cx="60" cy="64" rx="30" ry="26" fill="#FFB6C1"/><ellipse cx="38" cy="46" rx="10" ry="14" fill="#FF9EB5"/><ellipse cx="82" cy="46" rx="10" ry="14" fill="#FF9EB5"/><ellipse cx="60" cy="70" rx="12" ry="9" fill="#FF85A1"/><circle cx="56" cy="70" r="2" fill="#2D3748"/><circle cx="64" cy="70" r="2" fill="#2D3748"/><circle cx="48" cy="58" r="3" fill="#2D3748"/><circle cx="72" cy="58" r="3" fill="#2D3748"/>`,
  bee: `<ellipse cx="60" cy="62" rx="22" ry="18" fill="#FFD93D"/><rect x="38" y="54" width="44" height="6" fill="#2D3748"/><rect x="38" y="66" width="44" height="6" fill="#2D3748"/><ellipse cx="38" cy="48" rx="10" ry="8" fill="#FFF9C4" opacity="0.8"/><ellipse cx="82" cy="48" rx="10" ry="8" fill="#FFF9C4" opacity="0.8"/>`,
  butterfly: `<ellipse cx="44" cy="58" rx="18" ry="22" fill="#F48FB1"/><ellipse cx="76" cy="58" rx="18" ry="22" fill="#CE93D8"/><ellipse cx="60" cy="62" rx="6" ry="20" fill="#2D3748"/><path d="M60 42 Q55 28 48 32" stroke="#2D3748" stroke-width="2" fill="none"/><path d="M60 42 Q65 28 72 32" stroke="#2D3748" stroke-width="2" fill="none"/>`,
  flower: `<circle cx="60" cy="58" r="10" fill="#FFD93D"/><ellipse cx="60" cy="38" rx="10" ry="14" fill="#FF85A1"/><ellipse cx="78" cy="52" rx="10" ry="14" fill="#FF85A1" transform="rotate(72 60 58)"/><ellipse cx="70" cy="74" rx="10" ry="14" fill="#FF85A1" transform="rotate(144 60 58)"/><ellipse cx="50" cy="74" rx="10" ry="14" fill="#FF85A1" transform="rotate(216 60 58)"/><ellipse cx="42" cy="52" rx="10" ry="14" fill="#FF85A1" transform="rotate(288 60 58)"/><line x1="60" y1="68" x2="60" y2="92" stroke="#6BCB77" stroke-width="4"/>`,
  heart: `<path d="M60 88 C30 62 30 38 60 48 C90 38 90 62 60 88" fill="#FF6B6B"/>`,
  happy: `<circle cx="60" cy="60" r="32" fill="#FFD93D"/><circle cx="48" cy="54" r="4" fill="#2D3748"/><circle cx="72" cy="54" r="4" fill="#2D3748"/><path d="M44 72 Q60 84 76 72" stroke="#2D3748" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  sad: `<circle cx="60" cy="60" r="32" fill="#90CAF9"/><circle cx="48" cy="54" r="4" fill="#2D3748"/><circle cx="72" cy="54" r="4" fill="#2D3748"/><path d="M44 80 Q60 68 76 80" stroke="#2D3748" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  red: `<circle cx="60" cy="60" r="32" fill="#EF5350" stroke="#C62828" stroke-width="3"/>`,
  blue: `<circle cx="60" cy="60" r="32" fill="#42A5F5" stroke="#1565C0" stroke-width="3"/>`,
  green: `<circle cx="60" cy="60" r="32" fill="#66BB6A" stroke="#2E7D32" stroke-width="3"/>`,
  book: `<rect x="34" y="32" width="52" height="56" rx="4" fill="#4D96FF"/><rect x="38" y="36" width="44" height="48" rx="2" fill="#fff"/><line x1="60" y1="36" x2="60" y2="84" stroke="#4D96FF" stroke-width="2"/>`,
  hat: `<ellipse cx="60" cy="72" rx="34" ry="10" fill="#8E44AD"/><path d="M42 72 C42 40 78 40 78 72 Z" fill="#9B59B6"/><rect x="54" y="28" width="12" height="16" rx="2" fill="#8E44AD"/>`,
  cup: `<rect x="40" y="44" width="40" height="44" rx="6" fill="#FF85A1"/><rect x="44" y="48" width="32" height="12" fill="#fff" opacity="0.5"/><path d="M80 56 Q96 56 96 68 Q96 80 80 80" stroke="#FF85A1" stroke-width="4" fill="none"/>`,
  one: `<text x="60" y="78" font-size="56" font-weight="bold" font-family="Fredoka,Arial,sans-serif" fill="#FF6B6B" text-anchor="middle">1</text>`,
  two: `<text x="60" y="78" font-size="56" font-weight="bold" font-family="Fredoka,Arial,sans-serif" fill="#9B59B6" text-anchor="middle">2</text>`,
  hen: `<ellipse cx="60" cy="66" rx="24" ry="20" fill="#FFCC80"/><circle cx="60" cy="48" r="16" fill="#FFCC80"/><polygon points="48,40 44,24 52,36" fill="#FF6B6B"/><circle cx="54" cy="46" r="3" fill="#2D3748"/><path d="M68 48 L78 44 L78 52 Z" fill="#FFB347"/>`,
  elephant: `<ellipse cx="60" cy="70" rx="28" ry="22" fill="#B0BEC5"/><ellipse cx="38" cy="58" rx="14" ry="18" fill="#B0BEC5"/><path d="M82 58 Q98 58 98 72 Q98 86 88 82 L82 72" fill="#B0BEC5"/><circle cx="52" cy="62" r="3" fill="#2D3748"/><path d="M78 72 L88 88" stroke="#B0BEC5" stroke-width="6" stroke-linecap="round"/>`,
  snake: `<path d="M30 70 Q45 40 60 55 T90 48" stroke="#6BCB77" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="88" cy="46" r="5" fill="#2D3748"/><circle cx="91" cy="44" r="1.5" fill="#fff"/>`,
  bed: `<rect x="28" y="56" width="64" height="28" rx="6" fill="#8E44AD"/><rect x="28" y="48" width="16" height="20" rx="4" fill="#9B59B6"/><rect x="36" y="60" width="20" height="12" fill="#fff" opacity="0.4"/>`,
  hello: `<circle cx="48" cy="56" r="14" fill="#FFCCBC"/><rect x="58" y="68" width="8" height="24" rx="3" fill="#FFCCBC"/><path d="M36 48 Q48 28 60 48" stroke="#FFCCBC" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  run: `<circle cx="52" cy="36" r="10" fill="#4D96FF"/><line x1="52" y1="46" x2="52" y2="68" stroke="#4D96FF" stroke-width="5" stroke-linecap="round"/><line x1="52" y1="54" x2="36" y2="48" stroke="#4D96FF" stroke-width="4" stroke-linecap="round"/><line x1="52" y1="54" x2="68" y2="42" stroke="#4D96FF" stroke-width="4" stroke-linecap="round"/><line x1="52" y1="68" x2="38" y2="88" stroke="#4D96FF" stroke-width="4" stroke-linecap="round"/><line x1="52" y1="68" x2="66" y2="86" stroke="#4D96FF" stroke-width="4" stroke-linecap="round"/>`,
  hot: `<path d="M52 88 Q56 60 48 48 Q56 56 60 36 Q64 56 72 48 Q64 60 68 88 Z" fill="#FF6B6B"/><ellipse cx="60" cy="92" rx="16" ry="4" fill="#FF8A65" opacity="0.5"/>`,
  king: `<polygon points="60,30 68,50 88,50 72,62 78,82 60,70 42,82 48,62 32,50 52,50" fill="#FFD54F" stroke="#FFB347" stroke-width="2"/>`,
  watermelon: `<circle cx="60" cy="62" r="28" fill="#FF6B6B"/><path d="M32 62 Q60 34 88 62" fill="#6BCB77"/><circle cx="48" cy="58" r="2" fill="#2D3748"/><circle cx="68" cy="66" r="2" fill="#2D3748"/>`,
  banana: `<path d="M42 88 Q38 48 68 38 Q58 58 72 78 Q52 72 42 88" fill="#FFD93D" stroke="#FFB347" stroke-width="2"/>`,
  robot: `<rect x="38" y="40" width="44" height="40" rx="8" fill="#90A4AE"/><rect x="48" y="52" width="10" height="10" rx="2" fill="#4FC3F7"/><rect x="62" y="52" width="10" height="10" rx="2" fill="#4FC3F7"/><rect x="52" y="68" width="16" height="4" rx="2" fill="#546E7A"/><line x1="48" y1="32" x2="48" y2="40" stroke="#78909C" stroke-width="3"/><circle cx="48" cy="28" r="4" fill="#FF6B6B"/>`,
  three: `<text x="60" y="78" font-size="56" font-weight="bold" font-family="Fredoka,Arial,sans-serif" fill="#26A69A" text-anchor="middle">3</text>`,
  tiny: `<ellipse cx="60" cy="72" rx="8" ry="6" fill="#9E9E9E"/><circle cx="60" cy="58" r="10" fill="#9E9E9E"/><line x1="52" y1="52" x2="44" y2="44" stroke="#9E9E9E" stroke-width="2"/><line x1="68" y1="52" x2="76" y2="44" stroke="#9E9E9E" stroke-width="2"/><line x1="52" y1="78" x2="44" y2="88" stroke="#9E9E9E" stroke-width="2"/><line x1="68" y1="78" x2="76" y2="88" stroke="#9E9E9E" stroke-width="2"/><line x1="56" y1="84" x2="52" y2="94" stroke="#9E9E9E" stroke-width="2"/><line x1="64" y1="84" x2="68" y2="94" stroke="#9E9E9E" stroke-width="2"/><circle cx="56" cy="56" r="2" fill="#2D3748"/><circle cx="64" cy="56" r="2" fill="#2D3748"/>`
};

/** @param {string} word @param {string} bg @param {string} [label] */
export function wordCardSvg(word, bg, label = word) {
  const art = WORD_ART[word];
  const safeLabel = label.replace(/[<>&"]/g, '');
  const inner = art || `<text x="60" y="78" font-size="48" font-weight="bold" font-family="Fredoka,Arial,sans-serif" fill="#2D3748" text-anchor="middle">${word.charAt(0).toUpperCase()}</text>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="${safeLabel}">
  <defs>
    <linearGradient id="bg-${word.replace(/[^a-z0-9]/gi, '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#bg-${word.replace(/[^a-z0-9]/gi, '')})" stroke="rgba(0,0,0,0.1)" stroke-width="2"/>
  <circle cx="60" cy="60" r="48" fill="rgba(255,255,255,0.35)"/>
  ${inner}
</svg>`;
}

export function letterSvg(letter, bg) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="Letter ${letter.toUpperCase()}">
  <defs>
    <linearGradient id="lg-${letter}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0.5"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="28" fill="url(#lg-${letter})" stroke="rgba(0,0,0,0.08)" stroke-width="2"/>
  <circle cx="60" cy="60" r="44" fill="rgba(255,255,255,0.5)"/>
  <text x="60" y="78" font-size="64" font-weight="bold" font-family="Fredoka,Arial,sans-serif" fill="#2D3748" text-anchor="middle">${letter.toUpperCase()}</text>
</svg>`;
}

export const LETTER_COLORS = [
  '#FF6B6B', '#FF8E72', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF',
  '#FF85A1', '#5EBAD6', '#FFB347', '#98D8AA'
];
