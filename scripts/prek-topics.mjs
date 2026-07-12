/** Shared topical units for PreK/K zero-English vocabulary (source of truth). */

/**
 * @typedef {object} TopicUnit
 * @property {string} id
 * @property {number} order
 * @property {string} label
 * @property {string[]} prekWords
 * @property {string[]} [kExtraWords]
 * @property {string[]} [kSentences] — K speak_sentence variants (2–3 per unit)
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
    kSentences: ['Hello, friend!', 'Good morning!', 'Thank you, friend.'],
    speakWord: 'hello'
  },
  {
    id: 'colors',
    order: 2,
    label: 'Colors',
    prekWords: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown'],
    kSentences: ['It is red.', 'I see blue.', 'The ball is yellow.'],
    speakWord: 'red'
  },
  {
    id: 'numbers',
    order: 3,
    label: 'Numbers 1–10',
    prekWords: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
    kSentences: ['I see five.', 'I have three.', 'Count to ten.'],
    speakWord: 'five'
  },
  {
    id: 'shapes',
    order: 4,
    label: 'Shapes',
    prekWords: ['circle', 'square', 'triangle', 'star', 'heart', 'rectangle'],
    kSentences: ['It is a circle.', 'I see a star.', 'Draw a square.'],
    speakWord: 'circle'
  },
  {
    id: 'body',
    order: 5,
    label: 'My Body',
    prekWords: ['head', 'hand', 'foot', 'arm', 'leg', 'eye', 'ear', 'nose', 'mouth', 'finger'],
    kSentences: ['Touch your nose.', 'Wave your hand.', 'I have two eyes.'],
    speakWord: 'nose'
  },
  {
    id: 'family',
    order: 6,
    label: 'My Family',
    prekWords: ['mom', 'dad', 'sister', 'brother', 'baby', 'grandma', 'grandpa', 'family'],
    kSentences: ['This is my mom.', 'I love my family.', 'My baby is small.'],
    speakWord: 'mom'
  },
  {
    id: 'feelings',
    order: 7,
    label: 'Feelings',
    prekWords: ['happy', 'sad', 'angry', 'scared', 'tired', 'hungry', 'excited', 'fine'],
    kSentences: ['I am happy.', 'I feel tired.', 'Are you hungry?'],
    speakWord: 'happy'
  },
  {
    id: 'animals-pets',
    order: 8,
    label: 'Pets',
    prekWords: ['cat', 'dog', 'bird', 'fish', 'rabbit', 'hamster', 'turtle', 'pet'],
    kSentences: ['I have a cat.', 'The dog is big.', 'My fish swims.'],
    speakWord: 'cat'
  },
  {
    id: 'animals-farm',
    order: 9,
    label: 'Farm Animals',
    prekWords: ['pig', 'cow', 'duck', 'goat', 'sheep', 'hen', 'horse', 'barn'],
    kSentences: ['The cow is big.', 'I see a duck.', 'The horse runs fast.'],
    speakWord: 'cow'
  },
  {
    id: 'animals-wild',
    order: 10,
    label: 'Wild Animals',
    prekWords: ['elephant', 'tiger', 'snake', 'bear', 'butterfly', 'bee', 'frog', 'lion'],
    kSentences: ['I see a frog.', 'The lion is loud.', 'A bee can fly.'],
    speakWord: 'frog'
  },
  {
    id: 'food',
    order: 11,
    label: 'Food & Drink',
    prekWords: ['apple', 'banana', 'egg', 'milk', 'bread', 'rice', 'water', 'juice', 'cake', 'soup'],
    kSentences: ['I like apple.', 'I drink milk.', 'The cake is sweet.'],
    speakWord: 'apple'
  },
  {
    id: 'home-school',
    order: 12,
    label: 'Home & School',
    prekWords: ['house', 'bed', 'book', 'pencil', 'cup', 'chair', 'table', 'door', 'backpack', 'crayon'],
    kSentences: ['My book is red.', 'I sit on a chair.', 'Open the door.'],
    speakWord: 'book'
  },
  {
    id: 'clothes-weather',
    order: 13,
    label: 'Clothes & Weather',
    prekWords: ['hat', 'shoe', 'sock', 'shirt', 'pants', 'coat', 'sun', 'rain', 'cloud', 'snow'],
    kSentences: ['The sun is hot.', 'I wear a coat.', 'It is raining.'],
    speakWord: 'sun'
  },
  {
    id: 'actions-opposites',
    order: 14,
    label: 'Actions & Opposites',
    prekWords: ['run', 'jump', 'sit', 'eat', 'sleep', 'play', 'big', 'small', 'hot', 'cold'],
    kSentences: ['I can run.', 'Sit down, please.', 'The dog is small.'],
    speakWord: 'run'
  },
  {
    id: 'transport',
    order: 15,
    label: 'Getting Around',
    prekWords: ['bus', 'bike', 'boat', 'plane', 'train', 'truck', 'car', 'walk'],
    kSentences: ['I go by bus.', 'The train is fast.', 'We walk to school.'],
    speakWord: 'bus'
  },
  {
    id: 'places',
    order: 16,
    label: 'Places in Town',
    prekWords: ['park', 'school', 'shop', 'zoo', 'farm', 'beach', 'road', 'home'],
    kSentences: ['We go to the park.', 'I go to school.', 'The beach is fun.'],
    speakWord: 'park'
  },
  {
    id: 'classroom',
    order: 17,
    label: 'In the Classroom',
    prekWords: ['teacher', 'student', 'desk', 'paper', 'glue', 'scissors', 'paint', 'ruler'],
    kSentences: ['I have paper and glue.', 'The teacher helps me.', 'I use my ruler.'],
    speakWord: 'paper'
  }
];

/**
 * Review picture_vocab quizzes — one mix per completed topic band (units 1–4, 5–8, 9–12, 13–17).
 * Each quiz blends words from different units within that band.
 */
export const REVIEW_SETS = {
  preK: [
    { prompt: 'red', choices: ['red', 'hello', 'circle'], correctIndex: 0 },
    { prompt: 'mom', choices: ['cat', 'mom', 'happy'], correctIndex: 1 },
    { prompt: 'cow', choices: ['cow', 'apple', 'book'], correctIndex: 0 },
    { prompt: 'bus', choices: ['sun', 'bus', 'teacher'], correctIndex: 1 }
  ],
  K: [
    { prompt: 'good morning', choices: ['good morning', 'purple', 'triangle'], correctIndex: 0 },
    { prompt: 'family', choices: ['dog', 'family', 'tired'], correctIndex: 1 },
    { prompt: 'banana', choices: ['banana', 'frog', 'pencil'], correctIndex: 0 },
    { prompt: 'train', choices: ['coat', 'train', 'paper'], correctIndex: 1 }
  ]
};

/** @param {string} grade @param {TopicUnit} topic */
export function wordsForGrade(grade, topic) {
  if (grade === 'K') {
    return [...topic.prekWords, ...(topic.kExtraWords || [])];
  }
  return topic.prekWords;
}

/** K speak_sentence variants for a topic. */
export function sentencesForTopic(topic) {
  if (topic.kSentences?.length) return topic.kSentences;
  return [`I see a ${topic.prekWords[0]}.`];
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
