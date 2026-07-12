/** @typedef {{ id: string, grade: string, type: string, difficulty?: string, title: string, hint?: string, skills?: string[], standards?: string[], content: Record<string, unknown> }} Lesson */

/** @typedef {{ score: number, passed: boolean, details?: unknown }} ScoreResult */

/** @typedef {{ lesson: Lesson, container: HTMLElement, speak: (text: string) => Promise<void>, onComplete: (result: ScoreResult) => void, showToast: (msg: string, type?: string) => void, retryLesson?: () => void, loadNextLesson?: () => void, loadPracticeLesson?: () => void }} ActivityContext */

/** @typedef {{ type: string, label: string, render: (ctx: ActivityContext) => void | (() => void), score?: (input: unknown, lesson: Lesson) => ScoreResult }} ActivityHandler */

/** @type {Map<string, ActivityHandler>} */
const registry = new Map();

export function registerActivity(handler) {
  registry.set(handler.type, handler);
}

export function getActivity(type) {
  return registry.get(type);
}

export function getRegisteredTypes() {
  return [...registry.keys()];
}

export function renderActivity(type, ctx) {
  const handler = registry.get(type);
  if (!handler) {
    ctx.container.innerHTML = `<p class="empty-state">Activity type "${type}" is not available yet.</p>`;
    return null;
  }
  ctx.container.innerHTML = '';
  return handler.render(ctx);
}
