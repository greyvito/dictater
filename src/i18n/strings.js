export const strings = {
  en: {
    startLearning: 'Start learning',
    continueLesson: 'Continue',
    collapseHero: 'Minimize header',
    changeLesson: 'Change lesson',
    chooseLessonTitle: 'Choose a lesson',
    chooseLessonMeta: 'PreK–Grade 6 English Learning Studio',
    noLessons: 'No lessons yet for this skill. Try another area.',
    trySkill: 'Try another skill:',
    noCustomLessons: 'No saved lessons. Create one in More tools.',
    lessonCompleted: 'Completed',
    delete: 'Delete',
    lastLesson: 'Last lesson',
    pickGradeSkill: 'Pick a grade and skill to start learning.',
    moreTools: 'More tools',
    prekMenu: 'Lessons',
    tryAgain: 'Try again',
    nextLesson: 'Next lesson',
    noMoreLessons: 'No more lessons in this skill area.',
    placement: 'Take Placement Mini-Test',
    dashboard: 'Student Dashboard',
    offlineMode: 'Offline mode — progress saved on this device',
    signedInAs: 'Signed in as',
    chooseLesson: 'Select a grade, skill area, and lesson to begin.',
    mode: 'Mode',
    curriculum: 'Curriculum',
    myLessons: 'My Lessons',
    grade: 'Grade',
    skillArea: 'Skill Area',
    lessons: 'Lessons',
    assignments: 'Teacher Assignments',
    noAssignments: 'No assignments yet — your teacher can assign lessons from the teacher portal.',
    due: 'Due',
    account: 'Account (optional)',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    parentConsent: 'I am 13+ or have parent/guardian consent to use cloud sync',
    speechSettings: 'Speech Settings',
    createLesson: 'Create Custom Lesson',
    exportProgress: 'Export Progress (JSON)',
    language: 'Language',
    teacherPortal: 'Teacher portal',
    coppaNote: 'Cloud sync stores email and lesson scores only. Users under 13 need parental consent.',
    wordIntroInstruction: '{topic} — tap Next to learn each word',
    wordIntroBack: '← Back',
    wordIntroListen: '🔊 Listen',
    wordIntroNext: 'Next →',
    wordIntroFinish: 'Finish ✓',
    wordProgress: 'Word {current} of {total}',
    wordIntroComplete: '🌟 You learned {count} new words!',
    practiceQuiz: 'Practice quiz →',
    unitProgress: 'Unit Progress',
    unitProgressTitle: 'Vocabulary Units',
    unitProgressSummary: '{completed} of {total} lessons completed ({grade})',
    unitProgressLabel: 'Unit {order} — {label}',
    unitProgressFraction: '{completed}/{total}'
  },
  es: {
    startLearning: 'Empezar a aprender',
    continueLesson: 'Continuar',
    collapseHero: 'Minimizar encabezado',
    changeLesson: 'Cambiar lección',
    chooseLessonTitle: 'Elige una lección',
    chooseLessonMeta: 'Estudio de inglés PreK–Grado 6',
    noLessons: 'No hay lecciones para esta habilidad. Prueba otra área.',
    trySkill: 'Prueba otra habilidad:',
    noCustomLessons: 'Sin lecciones guardadas. Crea una en Más herramientas.',
    lessonCompleted: 'Completada',
    delete: 'Eliminar',
    lastLesson: 'Última lección',
    pickGradeSkill: 'Elige grado y habilidad para empezar.',
    moreTools: 'Más herramientas',
    prekMenu: 'Lecciones',
    tryAgain: 'Intentar de nuevo',
    nextLesson: 'Siguiente lección',
    noMoreLessons: 'No hay más lecciones en esta área.',
    placement: 'Examen de nivel',
    dashboard: 'Panel del estudiante',
    offlineMode: 'Modo sin conexión — progreso guardado en este dispositivo',
    signedInAs: 'Conectado como',
    chooseLesson: 'Elige grado, habilidad y lección para comenzar.',
    mode: 'Modo',
    curriculum: 'Plan de estudios',
    myLessons: 'Mis lecciones',
    grade: 'Grado',
    skillArea: 'Área',
    lessons: 'Lecciones',
    assignments: 'Tareas del profesor',
    noAssignments: 'Sin tareas todavía.',
    due: 'Entrega',
    account: 'Cuenta (opcional)',
    signIn: 'Entrar',
    signOut: 'Salir',
    parentConsent: 'Tengo 13+ años o permiso de un adulto',
    speechSettings: 'Configuración de voz',
    createLesson: 'Crear lección',
    exportProgress: 'Exportar progreso (JSON)',
    language: 'Idioma',
    teacherPortal: 'Portal del profesor',
    coppaNote: 'La sincronización guarda correo y puntajes solamente.',
    wordIntroInstruction: '{topic} — toca Siguiente para aprender cada palabra',
    wordIntroBack: '← Atrás',
    wordIntroListen: '🔊 Escuchar',
    wordIntroNext: 'Siguiente →',
    wordIntroFinish: 'Terminar ✓',
    wordProgress: 'Palabra {current} de {total}',
    wordIntroComplete: '🌟 ¡Aprendiste {count} palabras nuevas!',
    practiceQuiz: 'Práctica →',
    unitProgress: 'Progreso por unidad',
    unitProgressTitle: 'Unidades de vocabulario',
    unitProgressSummary: '{completed} de {total} lecciones completadas ({grade})',
    unitProgressLabel: 'Unidad {order} — {label}',
    unitProgressFraction: '{completed}/{total}'
  }
};

/**
 * @param {string} key
 * @param {string} [locale]
 * @param {Record<string, string | number>} [vars]
 */
export function t(key, locale = 'en', vars = {}) {
  let text = strings[locale]?.[key] || strings.en[key] || key;
  Object.entries(vars).forEach(([k, v]) => {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  });
  return text;
}

export function getLocale() {
  try {
    return localStorage.getItem('DICTATER_LOCALE') || 'en';
  } catch {
    return 'en';
  }
}

export function setLocale(locale) {
  localStorage.setItem('DICTATER_LOCALE', locale);
}

export function applyI18n(locale = getLocale()) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key, locale);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) el.placeholder = t(key, locale);
  });
  return locale;
}

export function trackEvent(name, payload = {}) {
  const events = getAnalyticsEvents();
  events.push({ name, payload, at: Date.now() });
  try {
    localStorage.setItem('DICTATER_ANALYTICS', JSON.stringify(events.slice(-500)));
  } catch {
    /* ignore quota */
  }
  if (typeof window !== 'undefined') {
    window.dictaterAnalytics = events;
  }
}

export function getAnalyticsEvents() {
  try {
    return JSON.parse(localStorage.getItem('DICTATER_ANALYTICS') || '[]');
  } catch {
    return [];
  }
}

export function exportAnalyticsBlob(stats) {
  const payload = {
    exportedAt: new Date().toISOString(),
    stats,
    events: getAnalyticsEvents()
  };
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
}
