import {
  normalizeChoices,
  resolvePromptVisual,
  CHOICE_CARD_COLORS
} from '../prek/images.js';
import { celebrateCorrect, encourageTryAgain, mountMascot } from '../prek/delight.js';
import { appendPostCheckActions } from './postCheck.js';

/**
 * @param {string} instruction
 * @param {ReturnType<typeof resolvePromptVisual>} promptVis
 */
function promptHtml(instruction, promptVis) {
  const label = promptVis?.label || '';
  const imgBlock = promptVis?.src
    ? `<img class="prek-prompt-img" src="${promptVis.src}" alt="${promptVis.alt}" width="140" height="140" loading="lazy">`
    : promptVis?.emoji
      ? `<span class="prek-prompt-emoji" aria-hidden="true">${promptVis.emoji}</span>`
      : `<span class="prek-prompt-text">${label}</span>`;

  return `
    <p class="prek-instruction">${instruction}</p>
    <div class="prek-prompt-card" id="prek-prompt">
      ${imgBlock}
      ${label && promptVis?.src ? `<span class="prek-prompt-label">${label}</span>` : ''}
    </div>
    <button type="button" class="btn-secondary btn-compact prek-listen-btn" id="prek-listen">🔊 Listen</button>`;
}

/**
 * @param {import('../prek/images.js').normalizeChoices extends (...args: any) => infer R ? R : never} choice
 * @param {number} index
 */
function choiceButtonHtml(choice, index) {
  const bg = CHOICE_CARD_COLORS[index % CHOICE_CARD_COLORS.length];
  const inner = choice.src
    ? `<img class="prek-choice-img" src="${choice.src}" alt="${choice.alt}" width="96" height="96" loading="lazy">`
    : `<span class="prek-choice-emoji" aria-hidden="true">${choice.emoji || '✨'}</span>`;
  return `
    <button type="button" class="prek-choice-card choice-btn" data-index="${index}" style="--prek-card-bg:${bg}" aria-label="${choice.label}">
      ${inner}
      <span class="prek-choice-label">${choice.label}</span>
    </button>`;
}

function renderChoices(ctx, config) {
  const { lesson, container, speak, onComplete, showToast } = ctx;
  const { prompt, choices, correctIndex, instruction, promptVis: overridePrompt } = config;
  let answered = false;

  const promptVis = overridePrompt || resolvePromptVisual({ prompt });
  const normalized = normalizeChoices(choices, correctIndex);

  container.innerHTML = `
    <div class="prek-activity">
      <div id="prek-mascot-slot"></div>
      ${promptHtml(instruction, promptVis)}
      <div class="prek-choice-grid" id="prek-choices" role="group" aria-label="Answer choices"></div>
      <div id="prek-feedback" class="prek-feedback result-card feedback hidden"></div>
    </div>`;

  mountMascot(container.querySelector('#prek-mascot-slot'));

  const choicesEl = container.querySelector('#prek-choices');
  normalized.forEach((choice, i) => {
    choicesEl.insertAdjacentHTML('beforeend', choiceButtonHtml(choice, i));
  });

  const speakPrompt = () => {
    speak(String(prompt)).catch(() => showToast('Audio unavailable', 'warning'));
  };

  container.querySelector('#prek-listen')?.addEventListener('click', speakPrompt);
  speakPrompt();

  choicesEl.querySelectorAll('.prek-choice-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const i = Number(btn.getAttribute('data-index'));
      const correct = i === correctIndex;
      btn.classList.add(correct ? 'choice-correct' : 'choice-wrong');
      if (!correct) {
        choicesEl.querySelectorAll('.prek-choice-card')[correctIndex]?.classList.add('choice-correct');
      }
      const fb = container.querySelector('#prek-feedback');
      fb.classList.remove('hidden');
      fb.classList.add(correct ? 'prek-feedback--yes' : 'prek-feedback--oops');
      const msg = document.createElement('p');
      msg.textContent = correct ? '🌟 Yes! You got it!' : `Nice try! The answer is "${normalized[correctIndex].label}".`;
      fb.replaceChildren(msg);
      appendPostCheckActions(fb, ctx, correct);

      const activity = container.querySelector('.prek-activity');
      if (correct && activity) celebrateCorrect(activity);
      else encourageTryAgain();

      onComplete({ score: correct ? 100 : 0, passed: correct });
    });
  });
}

export const rhymeActivity = {
  type: 'phonological_rhyme',
  label: 'Rhyme Match',
  render(ctx) {
    const c = ctx.lesson.content;
    renderChoices(ctx, {
      prompt: c.prompt,
      choices: c.choices,
      correctIndex: c.correctIndex,
      instruction: '👂 Which word rhymes?'
    });
  }
};

export const syllableActivity = {
  type: 'phonological_syllable',
  label: 'Syllable Count',
  render(ctx) {
    const c = ctx.lesson.content;
    const promptVis = resolvePromptVisual({ prompt: c.prompt, promptImage: c.promptImage });
    const choices = (c.choices || ['1', '2', '3']).map((n) => `${n} clap${n === '1' ? '' : 's'}`);
    renderChoices(ctx, {
      prompt: c.prompt,
      choices,
      correctIndex: c.correctIndex ?? 0,
      instruction: '👏 Clap the syllables! How many?',
      promptVis
    });
  }
};

export const initialSoundActivity = {
  type: 'phonological_initial',
  label: 'Beginning Sound',
  render(ctx) {
    const c = ctx.lesson.content;
    const promptVis = resolvePromptVisual({ prompt: c.prompt, promptImage: c.promptImage });
    renderChoices(ctx, {
      prompt: c.prompt,
      choices: c.choices,
      correctIndex: c.correctIndex,
      instruction: '🔤 What sound does it start with?',
      promptVis
    });
  }
};

export const letterSoundActivity = {
  type: 'letter_sound',
  label: 'Letter Sound Match',
  render(ctx) {
    const c = ctx.lesson.content;
    const promptVis = resolvePromptVisual({ letter: c.letter, promptImage: c.promptImage });
    renderChoices(ctx, {
      prompt: c.letter,
      choices: c.choices,
      correctIndex: c.correctIndex,
      instruction: '🖼️ Which picture starts with this letter?',
      promptVis
    });
  }
};

export const pictureVocabActivity = {
  type: 'picture_vocab',
  label: 'Picture Vocabulary',
  render(ctx) {
    const c = ctx.lesson.content;
    const promptVis = resolvePromptVisual({ prompt: c.prompt, promptImage: c.promptImage });
    renderChoices(ctx, {
      prompt: c.prompt,
      choices: c.choices,
      correctIndex: c.correctIndex,
      instruction: '🎯 Tap the picture you hear!',
      promptVis
    });
  }
};
