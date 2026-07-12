import { resolveWordVisual } from '../prek/images.js';
import { celebrateCorrect, mountMascot } from '../prek/delight.js';
import { appendPostCheckActions } from './postCheck.js';

/**
 * @param {HTMLElement} parent
 * @param {string} className
 * @param {string} [tag]
 */
function el(parent, tag = 'div', className = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  parent.appendChild(node);
  return node;
}

/**
 * @param {HTMLElement} cardEl
 * @param {string} word
 */
function renderWordCard(cardEl, word) {
  cardEl.replaceChildren();
  const vis = resolveWordVisual(word);
  if (vis.src) {
    const img = document.createElement('img');
    img.className = 'prek-prompt-img word-intro-img';
    img.src = vis.src;
    img.alt = vis.alt;
    img.width = 180;
    img.height = 180;
    img.loading = 'lazy';
    cardEl.appendChild(img);
  } else {
    const emoji = document.createElement('span');
    emoji.className = 'prek-prompt-emoji';
    emoji.setAttribute('aria-hidden', 'true');
    emoji.textContent = vis.emoji;
    cardEl.appendChild(emoji);
  }
  const label = document.createElement('span');
  label.className = 'prek-prompt-label word-intro-label';
  label.textContent = word;
  cardEl.appendChild(label);
}

/**
 * @param {import('./registry.js').ActivityContext} ctx
 */
export function renderWordIntro(ctx) {
  const { lesson, container, speak, onComplete, showToast } = ctx;
  const c = lesson.content || {};
  const words = Array.isArray(c.words) ? c.words.map(String) : [];
  if (!words.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No words in this lesson.';
    container.appendChild(empty);
    return;
  }

  let index = 0;
  let finished = false;
  const topicLabel = String(c.topic || lesson.topicLabel || lesson.title);

  const root = el(container, 'div', 'prek-activity word-intro-activity');
  const mascotSlot = el(root, 'div', '');
  mascotSlot.id = 'prek-mascot-slot';

  const instruction = el(root, 'p', 'prek-instruction');
  instruction.textContent = `📚 ${topicLabel} — tap Next to learn each word`;

  const progressEl = el(root, 'div', 'word-intro-progress');
  progressEl.id = 'word-intro-progress';
  progressEl.setAttribute('aria-live', 'polite');

  const cardEl = el(root, 'div', 'prek-prompt-card word-intro-card');
  cardEl.id = 'word-intro-card';

  const nav = el(root, 'div', 'word-intro-nav btn-row');
  const prevBtn = el(nav, 'button', 'btn-secondary btn-compact');
  prevBtn.type = 'button';
  prevBtn.id = 'word-intro-prev';
  prevBtn.textContent = '← Back';
  prevBtn.disabled = true;

  const listenBtn = el(nav, 'button', 'btn-secondary btn-compact prek-listen-btn');
  listenBtn.type = 'button';
  listenBtn.id = 'word-intro-listen';
  listenBtn.textContent = '🔊 Listen';

  const nextBtn = el(nav, 'button', 'btn-primary btn-compact');
  nextBtn.type = 'button';
  nextBtn.id = 'word-intro-next';
  nextBtn.textContent = 'Next →';

  const doneEl = el(root, 'div', 'prek-feedback result-card feedback hidden');
  doneEl.id = 'word-intro-done';

  mountMascot(mascotSlot);

  const speakWord = () => {
    const word = words[index];
    if (!word) return;
    speak(word).catch(() => showToast('Audio unavailable', 'warning'));
  };

  const renderCard = () => {
    const word = words[index];
    renderWordCard(cardEl, word);
    progressEl.textContent = `Word ${index + 1} of ${words.length}`;
    prevBtn.disabled = index === 0;
    nextBtn.textContent = index >= words.length - 1 ? 'Finish ✓' : 'Next →';
    speakWord();
  };

  const showFinish = () => {
    if (finished) return;
    finished = true;
    doneEl.classList.remove('hidden');
    doneEl.classList.add('prek-feedback--yes');
    const msg = document.createElement('p');
    msg.textContent = `🌟 You learned ${words.length} new words!`;
    doneEl.appendChild(msg);
    appendPostCheckActions(doneEl, ctx, true);

    if (c.practiceLessonId && ctx.loadPracticeLesson) {
      const practice = document.createElement('button');
      practice.type = 'button';
      practice.className = 'btn-primary btn-compact';
      practice.textContent = 'Practice quiz →';
      practice.addEventListener('click', () => ctx.loadPracticeLesson?.());
      let row = doneEl.querySelector('.post-check-actions');
      if (!row) {
        row = document.createElement('div');
        row.className = 'post-check-actions btn-row';
        doneEl.appendChild(row);
      }
      row.appendChild(practice);
    }

    celebrateCorrect(root);
    onComplete({ score: 100, passed: true });
  };

  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index -= 1;
      renderCard();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (index < words.length - 1) {
      index += 1;
      renderCard();
    } else {
      showFinish();
    }
  });

  listenBtn.addEventListener('click', speakWord);
  renderCard();
}

export const wordIntroActivity = {
  type: 'word_intro',
  label: 'Word Introduction',
  render: renderWordIntro
};
