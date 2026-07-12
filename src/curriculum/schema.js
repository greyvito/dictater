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
  'word_intro',
  'phonics_blend',
  'sight_word',
  'comprehension',
  'grammar_fix',
  'vocabulary_context',
  'sentence_builder',
  'writing_prompt'
];

export const GRADES = ['preK', 'K', '1', '2', '3', '4', '5', '6'];

// Early grades (PreK, K): learners are pre-readers, so the app focuses on
// spoken/aural skills — vocabulary first — instead of reading/writing.
export const EARLY_GRADES = ['preK', 'K'];

// Skill areas offered for early grades, in display order (vocabulary first).
export const EARLY_GRADE_SKILLS = ['vocabulary', 'sounds', 'phonics', 'speaking'];

export function isEarlyGrade(grade) {
  return EARLY_GRADES.includes(grade);
}

/** Skill areas to offer for a grade, in display order. */
export function skillAreasForGrade(grade) {
  if (isEarlyGrade(grade)) {
    return EARLY_GRADE_SKILLS.map((id) => SKILL_AREAS.find((s) => s.id === id)).filter(Boolean);
  }
  return SKILL_AREAS;
}

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
    word_intro: 'vocabulary',
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
