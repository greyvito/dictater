import { getLocale, t } from '../i18n/strings.js';

/**
 * @param {HTMLElement} parent
 * @param {import('./registry.js').ActivityContext} ctx
 * @param {boolean} [passed]
 */
export function appendPostCheckActions(parent, ctx, passed = true) {
  const { retryLesson, loadNextLesson } = ctx;
  if (!retryLesson && !loadNextLesson) return;

  const locale = getLocale();
  let row = parent.querySelector('.post-check-actions');
  if (!row) {
    row = document.createElement('div');
    row.className = 'post-check-actions btn-row';
    parent.appendChild(row);
  }
  row.replaceChildren();

  if (retryLesson) {
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'btn-secondary btn-compact';
    retry.textContent = t('tryAgain', locale);
    retry.addEventListener('click', () => retryLesson());
    row.appendChild(retry);
  }
  if (loadNextLesson && passed) {
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn-primary btn-compact';
    next.textContent = t('nextLesson', locale);
    next.addEventListener('click', () => loadNextLesson());
    row.appendChild(next);
  }
}

/**
 * @param {HTMLElement} container
 * @param {import('./registry.js').ActivityContext} ctx
 * @param {{ score: number, passed: boolean, summary: string }} result
 */
export function showActivityResult(container, ctx, result) {
  container.replaceChildren();
  const card = document.createElement('div');
  card.className = 'result-card feedback';

  const header = document.createElement('div');
  header.className = 'result-header';
  const scoreEl = document.createElement('div');
  scoreEl.className = 'result-score';
  scoreEl.textContent = `${result.score}%`;
  header.appendChild(scoreEl);
  card.appendChild(header);

  const summary = document.createElement('p');
  summary.textContent = result.summary;
  card.appendChild(summary);

  appendPostCheckActions(card, ctx, result.passed);
  container.appendChild(card);
}
