export const strings = {
  en: {
    startLearning: 'Start learning',
    placement: 'Take Placement Mini-Test',
    dashboard: 'Student Dashboard',
    offlineMode: 'Offline mode — progress saved on this device',
    chooseLesson: 'Select a grade, skill area, and lesson to begin.'
  },
  es: {
    startLearning: 'Empezar',
    placement: 'Examen de nivel',
    dashboard: 'Panel del estudiante',
    offlineMode: 'Modo sin conexión',
    chooseLesson: 'Elige grado, habilidad y lección.'
  }
};

export function t(key, locale = 'en') {
  return strings[locale]?.[key] || strings.en[key] || key;
}

export function trackEvent(name, payload = {}) {
  if (typeof window !== 'undefined' && window.dictaterAnalytics) {
    window.dictaterAnalytics.push({ name, payload, at: Date.now() });
  }
  console.debug('[Analytics]', name, payload);
}
