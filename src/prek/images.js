/** PreK word → illustration path. SVGs live in /images/prek/ */

const BASE = '/images/prek';

/** @type {Record<string, string>} */
export const WORD_EMOJI = {
  cat: '🐱', dog: '🐶', sun: '☀️', ball: '⚽', hat: '🎩', fish: '🐟', tree: '🌳',
  book: '📖', apple: '🍎', bird: '🐦', car: '🚗', star: '⭐', house: '🏠', moon: '🌙',
  bed: '🛏️', cup: '🥤', pig: '🐷', hen: '🐔', bat: '🦇', bee: '🐝', butterfly: '🦋',
  elephant: '🐘', flower: '🌸', snake: '🐍', tiger: '🐯', goat: '🐐', jam: '🍓',
  kite: '🪁', log: '🪵', map: '🗺️', net: '🥅', pencil: '✏️', robot: '🤖', shoe: '👟',
  sock: '🧦', spoon: '🥄', watermelon: '🍉', egg: '🥚', fan: '🌀', hand: '✋',
  heart: '❤️', banana: '🍌', dish: '🍽️', run: '🏃', tall: '🦒', king: '👑',
  ring: '💍', light: '💡', night: '🌃', day: '🌤️', happy: '😊', sad: '😢',
  angry: '😠', hot: '🔥', blue: '🔵', green: '🟢', red: '🔴', big: '🐘',
  small: '🐭', tiny: '🐜', hello: '👋', friend: '🤝', 'thank you': '🙏', one: '1️⃣', two: '2️⃣',
  three: '3️⃣', ch: '🐔', sh: '🐚', hippopotamus: '🦛',
  goodbye: '👋', please: '🙏', sorry: '😔', yes: '✅', no: '❌',
  'good morning': '🌅', 'good night': '🌙',
  yellow: '🟡', orange: '🟠', purple: '🟣', pink: '💗', black: '⬛', white: '⬜', brown: '🟤',
  four: '4️⃣', five: '5️⃣', six: '6️⃣', seven: '7️⃣', eight: '8️⃣', nine: '9️⃣', ten: '🔟',
  circle: '⭕', square: '⬜', triangle: '🔺', rectangle: '▭',
  head: '🙂', foot: '🦶', arm: '💪', leg: '🦵', eye: '👁️', ear: '👂', nose: '👃', mouth: '👄', finger: '☝️',
  mom: '👩', dad: '👨', sister: '👧', brother: '👦', baby: '👶', grandma: '👵', grandpa: '👴', family: '👨‍👩‍👧',
  scared: '😨', tired: '😴', hungry: '🍽️', excited: '🤩', fine: '🙂',
  rabbit: '🐰', hamster: '🐹', turtle: '🐢', pet: '🐾',
  cow: '🐄', duck: '🦆', sheep: '🐑', horse: '🐴', barn: '🏚️',
  bear: '🐻', frog: '🐸', lion: '🦁',
  milk: '🥛', bread: '🍞', rice: '🍚', water: '💧', juice: '🧃', cake: '🎂', soup: '🍲',
  chair: '🪑', table: '🪑', door: '🚪', backpack: '🎒', crayon: '🖍️',
  shirt: '👕', pants: '👖', coat: '🧥',
  rain: '🌧️', cloud: '☁️', snow: '❄️', cold: '🥶',
  jump: '⬆️', sit: '🪑', eat: '🍴', sleep: '😴', play: '🎮',
  mat: '🧺', bag: '👜', cap: '🧢', bug: '🐛', mud: '🟤', wig: '💇',
  bin: '🗑️', pen: '🖊️', pin: '📌', tin: '🥫', van: '🚐', zip: '🤐',
  chin: '🙂', chip: '🍟', ship: '🚢', drum: '🥁', flag: '🚩',
  clap: '👏', stop: '🛑', swim: '🏊', spin: '🌀', plug: '🔌',
  leaf: '🍃', fox: '🦊', deer: '🦌', owl: '🦉', gate: '🚧',
  bike: '🚲', rope: '🪢', tube: '🧪', lake: '🏞️', home: '🏠',
  rose: '🌹', nest: '🪺', pond: '🌊', farm: '🌾', wind: '💨', fire: '🔥',
  bus: '🚌', boat: '⛵', plane: '✈️', train: '🚂', truck: '🚚', walk: '🚶',
  park: '🌳', school: '🏫', shop: '🏪', zoo: '🦁', beach: '🏖️', road: '🛣️',
  teacher: '👩‍🏫', student: '🧑‍🎓', desk: '🪑', paper: '📄', glue: '🧴',
  scissors: '✂️', paint: '🎨', ruler: '📏'
};

/** Words with generated SVG files (see scripts/generate-prek-svgs.mjs) */
export const ILLUSTRATED_WORDS = new Set(Object.keys(WORD_EMOJI));

/** @param {string} raw */
export function normalizeWord(raw) {
  if (!raw) return '';
  return String(raw)
    .toLowerCase()
    .replace(/^\/([a-z]+)\/$/, '$1')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

/** @param {string} word */
export function imagePathForWord(word) {
  const key = normalizeWord(word);
  if (!key) return null;
  if (key.length === 1 && /[a-z]/.test(key)) return `${BASE}/letters/${key}.svg`;
  if (ILLUSTRATED_WORDS.has(key)) return `${BASE}/${key.replace(/\s+/g, '-')}.svg`;
  return null;
}

/** @param {string} word */
export function emojiForWord(word) {
  const key = normalizeWord(word);
  return WORD_EMOJI[key] || '✨';
}

/**
 * @param {string} word
 * @returns {{ src: string | null, emoji: string, alt: string, label: string }}
 */
export function resolveWordVisual(word) {
  const label = String(word);
  return {
    src: imagePathForWord(word),
    emoji: emojiForWord(word),
    alt: label,
    label
  };
}

/**
 * @param {string[] | Array<{ label: string, image?: string }>} choices
 * @param {number} correctIndex
 */
export function normalizeChoices(choices, correctIndex) {
  if (!Array.isArray(choices)) return [];
  return choices.map((c, i) => {
    if (c && typeof c === 'object' && 'label' in c) {
      const vis = c.image
        ? { src: c.image, emoji: '', alt: c.label, label: c.label }
        : resolveWordVisual(c.label);
      return { ...vis, correct: i === correctIndex };
    }
    const vis = resolveWordVisual(String(c));
    return { ...vis, correct: i === correctIndex };
  });
}

/** @param {{ prompt?: string, promptImage?: string, letter?: string }} content */
export function resolvePromptVisual(content) {
  if (content.promptImage) {
    return {
      src: content.promptImage,
      emoji: '',
      alt: content.prompt || 'Picture',
      label: content.prompt || ''
    };
  }
  if (content.letter) return resolveWordVisual(content.letter);
  if (content.prompt) return resolveWordVisual(content.prompt);
  return null;
}

export const CHOICE_CARD_COLORS = [
  '#FFE082', '#F8BBD0', '#B3E5FC', '#C8E6C9', '#FFCCBC', '#E1BEE7', '#FFF59D', '#B2DFDB'
];
