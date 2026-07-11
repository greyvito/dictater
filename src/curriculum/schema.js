export const SKILL_AREAS = [
  { id: 'listening', label: 'Listening', icon: '🎧' },
  { id: 'speaking', label: 'Speaking', icon: '🎙️' },
  { id: 'reading', label: 'Reading', icon: '📖' },
  { id: 'writing', label: 'Writing', icon: '✍️' },
  { id: 'phonics', label: 'Phonics', icon: '🔤' },
  { id: 'grammar', label: 'Grammar', icon: '📝' },
  { id: 'vocabulary', label: 'Vocabulary', icon: '💬' },
  { id: 'sounds', label: 'Sounds', icon: '👂' }
];

export const ACTIVITY_TYPES = [
  'dictation',
  'spelling',
  'speak_word',
  'speak_sentence',
  'speak_passage',
  'speak_repeat',
  'phonological_rhyme',
  'phonological_syllable',
  'phonological_initial',
  'letter_sound',
  'picture_vocab',
  'phonics_blend',
  'sight_word',
  'comprehension',
  'grammar_fix',
  'vocabulary_context',
  'sentence_builder',
  'writing_prompt'
];

export const GRADES = ['preK', 'K', '1', '2', '3', '4', '5', '6'];

export function gradeLabel(grade) {
  if (grade === 'preK') return 'PreK';
  if (grade === 'K') return 'Kindergarten';
  return `Grade ${grade}`;
}

/** @param {unknown} lesson */
export function validateLesson(lesson) {
  const errors = [];
  if (!lesson || typeof lesson !== 'object') {
    return ['Lesson must be an object'];
  }
  const l = /** @type {Record<string, unknown>} */ (lesson);
  if (!l.id || typeof l.id !== 'string') errors.push('Missing id');
  if (!l.grade || typeof l.grade !== 'string') errors.push('Missing grade');
  if (!l.type || !ACTIVITY_TYPES.includes(l.type)) errors.push(`Invalid type: ${l.type}`);
  if (!l.title || typeof l.title !== 'string') errors.push('Missing title');
  if (!l.content || typeof l.content !== 'object') errors.push('Missing content');
  return errors;
}

export function skillAreaForType(type) {
  const map = {
    dictation: 'listening',
    spelling: 'writing',
    speak_word: 'speaking',
    speak_sentence: 'speaking',
    speak_passage: 'speaking',
    speak_repeat: 'speaking',
    phonological_rhyme: 'sounds',
    phonological_syllable: 'sounds',
    phonological_initial: 'sounds',
    letter_sound: 'phonics',
    picture_vocab: 'vocabulary',
    phonics_blend: 'phonics',
    sight_word: 'reading',
    comprehension: 'reading',
    grammar_fix: 'grammar',
    vocabulary_context: 'vocabulary',
    sentence_builder: 'writing',
    writing_prompt: 'writing'
  };
  return map[type] || 'listening';
}
