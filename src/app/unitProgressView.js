import { buildUnitProgressRows, summarizeUnitProgress, UNIT_VOCAB_TYPES } from '../curriculum/unitProgress.js';
import { getLessonsForGrade } from '../curriculum/loader.js';
import { gradeLabel } from '../curriculum/schema.js';
import { t } from '../i18n/strings.js';

/**
 * @param {HTMLElement} container
 * @param {{ grade: string, completedIds: Set<string>, locale?: string }} opts
 */
export function renderUnitProgressPanel(container, { grade, completedIds, locale = 'en' }) {
  container.replaceChildren();

  const lessons = getLessonsForGrade(grade).filter(
    (lesson) => lesson.topic && UNIT_VOCAB_TYPES.has(lesson.type)
  );
  const rows = buildUnitProgressRows(lessons, completedIds);
  const summary = summarizeUnitProgress(rows);

  const note = document.createElement('p');
  note.className = 'settings-note unit-progress-summary';
  note.textContent = t('unitProgressSummary', locale, {
    completed: summary.completed,
    total: summary.total,
    grade: gradeLabel(grade)
  });
  container.appendChild(note);

  const list = document.createElement('div');
  list.className = 'unit-progress-list';
  list.setAttribute('role', 'list');

  rows.forEach((row) => {
    list.appendChild(renderUnitRow(row, locale));
  });

  container.appendChild(list);
}

/**
 * @param {import('../curriculum/unitProgress.js').UnitProgressRow} row
 * @param {string} locale
 */
function renderUnitRow(row, locale) {
  const item = document.createElement('div');
  item.className = 'unit-progress-row';
  item.setAttribute('role', 'listitem');

  const header = document.createElement('div');
  header.className = 'unit-progress-row__header';

  const title = document.createElement('span');
  title.className = 'unit-progress-row__title';
  title.textContent = row.order === 99
    ? row.label
    : t('unitProgressLabel', locale, { order: row.order, label: row.label });

  const fraction = document.createElement('span');
  fraction.className = 'unit-progress-row__fraction';
  fraction.textContent = t('unitProgressFraction', locale, {
    completed: row.completed,
    total: row.total
  });

  header.appendChild(title);
  header.appendChild(fraction);
  item.appendChild(header);

  const bar = document.createElement('div');
  bar.className = 'unit-progress-bar';
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', String(row.total || 100));
  bar.setAttribute('aria-valuenow', String(row.completed));
  bar.setAttribute('aria-label', `${title.textContent}: ${fraction.textContent}`);

  const fill = document.createElement('div');
  fill.className = 'unit-progress-bar__fill';
  fill.style.width = `${row.pct}%`;
  bar.appendChild(fill);
  item.appendChild(bar);

  return item;
}
