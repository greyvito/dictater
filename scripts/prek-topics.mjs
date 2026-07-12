/** Shared topical units for PreK/K zero-English vocabulary (source of truth). */

/**
 * @typedef {object} TopicUnit
 * @property {string} id
 * @property {number} order
 * @property {string} label
 * @property {string[]} prekWords
 * @property {string[]} [kExtraWords]
 * @property {string} [kSentence]
 * @property {string} [speakWord] — representative word for speak_repeat
 */

/** @type {TopicUnit[]} */
export const TOPIC_UNITS = [
  {
    id: 'hello-manners',
    order: 1,
    label: 'Hello & Manners',
    prekWords: ['hello', 'goodbye', 'please', 'thank you', 'sorry', 'yes', 'no', 'friend'],
    kExtraWords: ['good morning', 'good night'],
    kSentence: 'Hello, friend!',
    speakWord: 'hello'
  },
  {
    id: 'colors',
    order: 2,
    label: 'Colors',
    prekWords: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown'],
    kSentence: 'It is red.',
    speakWord: 'red'
  },
  {
    id: 'numbers',
    order: 3,
    label: 'Numbers 1–10',
    prekWords: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
    kSentence: 'I see five.',
    speakWord: 'five'
  },
  {
    id: 'shapes',
    order: 4,
    label: 'Shapes',
    prekWords: ['circle', 'square', 'triangle', 'star', 'heart', 'rectangle'],
    kSentence: 'It is a circle.',
    speakWord: 'circle'
  },
  {
    id: 'body',
    order: 5,
    label: 'My Body',
    prekWords: ['head', 'hand', 'foot', 'arm', 'leg', 'eye', 'ear', 'nose', 'mouth', 'finger'],
    kSentence: 'Touch your nose.',
    speakWord: 'nose'
  },
  {
    id: 'family',
    order: 6,
    label: 'My Family',
    prekWords: ['mom', 'dad', 'sister', 'brother', 'baby', 'grandma', 'grandpa', 'family'],
    kSentence: 'This is my mom.',
    speakWord: 'mom'
  },
  {
    id: 'feelings',
    order: 7,
    label: 'Feelings',
    prekWords: ['happy', 'sad', 'angry', 'scared', 'tired', 'hungry', 'excited', 'fine'],
    kSentence: 'I am happy.',
    speakWord: 'happy'
  },
  {
    id: 'animals-pets',
    order: 8,
    label: 'Pets',
    prekWords: ['cat', 'dog', 'bird', 'fish', 'rabbit', 'hamster', 'turtle', 'pet'],
    kSentence: 'I have a cat.',
    speakWord: 'cat'
  },
  {
    id: 'animals-farm',
    order: 9,
    label: 'Farm Animals',
    prekWords: ['pig', 'cow', 'duck', 'goat', 'sheep', 'hen', 'horse', 'barn'],
    kSentence: 'The cow is big.',
    speakWord: 'cow'
  },
  {
    id: 'animals-wild',
    order: 10,
    label: 'Wild Animals',
    prekWords: ['elephant', 'tiger', 'snake', 'bear', 'butterfly', 'bee', 'frog', 'lion'],
    kSentence: 'I see a frog.',
    speakWord: 'frog'
  },
  {
    id: 'food',
    order: 11,
    label: 'Food & Drink',
    prekWords: ['apple', 'banana', 'egg', 'milk', 'bread', 'rice', 'water', 'juice', 'cake', 'soup'],
    kSentence: 'I like apple.',
    speakWord: 'apple'
  },
  {
    id: 'home-school',
    order: 12,
    label: 'Home & School',
    prekWords: ['house', 'bed', 'book', 'pencil', 'cup', 'chair', 'table', 'door', 'backpack', 'crayon'],
    kSentence: 'My book is red.',
    speakWord: 'book'
  },
  {
    id: 'clothes-weather',
    order: 13,
    label: 'Clothes & Weather',
    prekWords: ['hat', 'shoe', 'sock', 'shirt', 'pants', 'coat', 'sun', 'rain', 'cloud', 'snow'],
    kSentence: 'The sun is hot.',
    speakWord: 'sun'
  },
  {
    id: 'actions-opposites',
    order: 14,
    label: 'Actions & Opposites',
    prekWords: ['run', 'jump', 'sit', 'eat', 'sleep', 'play', 'big', 'small', 'hot', 'cold'],
    kSentence: 'I can run.',
    speakWord: 'run'
  },
  {
    id: 'transport',
    order: 15,
    label: 'Getting Around',
    prekWords: ['bus', 'bike', 'boat', 'plane', 'train', 'truck', 'car', 'walk'],
    kSentence: 'I go by bus.',
    speakWord: 'bus'
  },
  {
    id: 'places',
    order: 16,
    label: 'Places in Town',
    prekWords: ['park', 'school', 'shop', 'zoo', 'farm', 'beach', 'road', 'home'],
    kSentence: 'We go to the park.',
    speakWord: 'park'
  },
  {
    id: 'classroom',
    order: 17,
    label: 'In the Classroom',
    prekWords: ['teacher', 'student', 'desk', 'paper', 'glue', 'scissors', 'paint', 'ruler'],
    kSentence: 'I have paper and glue.',
    speakWord: 'paper'
  }
];

/** Review picture_vocab quizzes mixing words from different units (per grade). */
export const REVIEW_SETS = {
  preK: [
    { prompt: 'red', choices: ['red', 'dog', 'five'], correctIndex: 0 },
    { prompt: 'apple', choices: ['cat', 'apple', 'run'], correctIndex: 1 },
    { prompt: 'mom', choices: ['sun', 'bed', 'mom'], correctIndex: 2 }
  ],
  K: [
    { prompt: 'school', choices: ['school', 'bike', 'happy'], correctIndex: 0 },
    { prompt: 'bus', choices: ['bus', 'fish', 'three'], correctIndex: 0 },
    { prompt: 'paper', choices: ['glue', 'paper', 'star'], correctIndex: 1 }
  ]
};

/** @param {string} grade @param {TopicUnit} topic */
export function wordsForGrade(grade, topic) {
  if (grade === 'K') {
    return [...topic.prekWords, ...(topic.kExtraWords || [])];
  }
  return topic.prekWords;
}

/**
 * Build picture_vocab quiz items: groups of 3 words from the topic.
 * @param {string[]} words
 * @returns {Array<{ prompt: string, choices: string[], correctIndex: number }>}
 */
export function buildPictureQuizzes(words) {
  const quizzes = [];
  const pool = [...words];
  for (let i = 0; i < pool.length; i += 3) {
    const chunk = pool.slice(i, i + 3);
    if (chunk.length < 3) {
      const pad = pool.filter((w) => !chunk.includes(w)).slice(0, 3 - chunk.length);
      while (chunk.length < 3 && pad.length) chunk.push(pad.shift());
    }
    if (chunk.length < 3) continue;
    chunk.forEach((prompt, correctIndex) => {
      const choices = [...chunk];
      quizzes.push({ prompt, choices, correctIndex });
    });
  }
  return quizzes.slice(0, 2);
}

/** @param {string} slug */
export function topicById(slug) {
  return TOPIC_UNITS.find((t) => t.id === slug);
}

/** All unique vocabulary words across topics (for illustration QA). */
export function allTopicWords() {
  const set = new Set();
  TOPIC_UNITS.forEach((t) => {
    t.prekWords.forEach((w) => set.add(w));
    (t.kExtraWords || []).forEach((w) => set.add(w));
  });
  return [...set].sort();
}
