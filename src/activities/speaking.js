import { renderDiffToContainer } from '../grading/wordDiff.js';
import { listenOnce, scoreSpeech, isSTTSupported } from '../speech/stt.js';
import { fetchWhisperStatus } from '../speech/whisper.js';
import { resolveWordVisual } from '../prek/images.js';
import { celebrateCorrect, encourageTryAgain, mountMascot } from '../prek/delight.js';

function micButtonHtml(id) {
  return `<button type="button" class="btn-circle speak-mic-btn" id="${id}" aria-label="Start speaking">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
  </button>`;
}

function renderSpeakingSession(ctx, config) {
  const { lesson, container, speak, onComplete, showToast } = ctx;
  const {
    items,
    mode,
    getExpected,
    getLabel
  } = config;

  if (!isSTTSupported()) {
    container.innerHTML = `<p class="empty-state">Speaking needs Chrome/Edge (browser speech) or local Whisper (<code>npm run whisper</code>). See docs/LOCAL.md.</p>`;
    return;
  }

  let itemIdx = 0;
  let attempts = 0;
  const maxAttempts = /** @type {number} */ (lesson.content.maxAttempts) || 3;
  const results = [];

  const isPrek = lesson.grade === 'preK';

  container.innerHTML = `
    <div class="speaking-workspace${isPrek ? ' speaking-workspace--prek' : ''}">
      ${isPrek ? '<div id="prek-mascot-slot"></div>' : ''}
      <p class="input-label" id="speak-label"></p>
      <div class="speak-target-card" id="speak-target"></div>
      <div class="speak-controls">
        <button type="button" class="btn-secondary btn-compact" id="speak-listen">Listen</button>
        ${micButtonHtml('speak-mic')}
        <span class="phrase-progress" id="speak-attempts">Attempt 1 of ${maxAttempts}</span>
      </div>
      <p class="settings-note" id="speak-heard"></p>
      <div id="speak-feedback" class="diff-container hidden"></div>
      <div class="actions-row hidden" id="speak-next-row">
        <button type="button" class="btn-primary" id="speak-next">Next</button>
      </div>
      <div id="speak-summary" class="result-card feedback hidden"></div>
    </div>`;

  const labelEl = container.querySelector('#speak-label');
  const targetEl = container.querySelector('#speak-target');
  const attemptsEl = container.querySelector('#speak-attempts');
  const heardEl = container.querySelector('#speak-heard');
  const feedbackEl = container.querySelector('#speak-feedback');
  const nextRow = container.querySelector('#speak-next-row');
  const summaryEl = container.querySelector('#speak-summary');
  const micBtn = container.querySelector('#speak-mic');

  if (isPrek) mountMascot(container.querySelector('#prek-mascot-slot'));

  fetchWhisperStatus().then((s) => {
    if (!s.available) return;
    const note = document.createElement('p');
    note.className = 'settings-note';
    note.textContent = `Using local Whisper (${s.model || 'tiny'}) — better accuracy on laptop`;
    container.querySelector('.speaking-workspace')?.prepend(note);
  });

  const loadItem = () => {
    attempts = 0;
    const item = items[itemIdx];
    const expected = getExpected(item);
    labelEl.textContent = getLabel(item, itemIdx, items.length);
    if (isPrek) {
      const vis = resolveWordVisual(expected);
      targetEl.innerHTML = vis.src
        ? `<img class="prek-prompt-img prek-speak-img" src="${vis.src}" alt="${vis.alt}" width="160" height="160"><span class="prek-prompt-label">${expected}</span>`
        : `<span class="prek-prompt-emoji">${vis.emoji}</span><span class="prek-prompt-label">${expected}</span>`;
      targetEl.classList.add('prek-prompt-card');
    } else {
      targetEl.classList.remove('prek-prompt-card');
      targetEl.textContent = lesson.content.showText ? expected : 'Tap Listen, then speak';
    }
    heardEl.textContent = '';
    feedbackEl.classList.add('hidden');
    nextRow.classList.add('hidden');
    attemptsEl.textContent = `Attempt 1 of ${maxAttempts}`;
    container.querySelector('#speak-listen').onclick = () => {
      speak(expected).catch(() => showToast('Could not play model audio', 'warning'));
    };
  };

  const finishAll = () => {
    const avg = Math.round(results.reduce((a, r) => a + r.score, 0) / results.length);
    summaryEl.innerHTML = `<div class="result-header"><h3 class="section-title section-title--plain">Speaking Summary</h3><div class="result-score">${avg}%</div></div>`;
    results.forEach((r) => {
      const row = document.createElement('div');
      row.className = 'activity-log-entry';
      row.innerHTML = `<span>${r.label}</span><span class="${r.passed ? 'score-high' : 'score-low'}">${r.score}%</span>`;
      summaryEl.appendChild(row);
    });
    summaryEl.classList.remove('hidden');
    onComplete({ score: avg, passed: avg >= 70, details: { results } });
  };

  micBtn.addEventListener('click', async () => {
    const item = items[itemIdx];
    const expected = getExpected(item);
    attempts++;
    attemptsEl.textContent = `Attempt ${attempts} of ${maxAttempts}`;
    micBtn.classList.add('speaker-playing');
    heardEl.textContent = 'Listening…';
    try {
      const transcript = await listenOnce({
        continuous: mode !== 'word',
        mode,
        expectedHint: expected
      });
      heardEl.textContent = `You said: "${transcript}"`;
      const result = scoreSpeech(expected, transcript, {
        mode,
        fuzzy: true,
        childMode: true,
        alternatives: /** @type {string[]} */ (lesson.content.acceptAlternatives || [])
      });
      feedbackEl.classList.remove('hidden');
      renderDiffToContainer(feedbackEl, result.alignment, {
        onWordClick: (word) => {
          speak(word).catch(() => showToast('Could not play word', 'warning'));
        }
      });
      if (result.passed || attempts >= maxAttempts) {
        results.push({ label: expected, score: result.score, passed: result.passed });
        nextRow.classList.remove('hidden');
        container.querySelector('#speak-next').onclick = () => {
          itemIdx++;
          if (itemIdx >= items.length) finishAll();
          else loadItem();
        };
        if (result.passed) {
          showToast('Great job!', 'success');
          if (isPrek) celebrateCorrect(container.querySelector('.speaking-workspace') || container);
        } else if (attempts >= maxAttempts) {
          showToast('Here is the model — try again later', 'info');
          speak(expected).catch(() => {});
          if (isPrek) {
            const vis = resolveWordVisual(expected);
            targetEl.innerHTML = vis.src
              ? `<img class="prek-prompt-img prek-speak-img" src="${vis.src}" alt="${vis.alt}" width="160" height="160"><span class="prek-prompt-label">${expected}</span>`
              : `<span class="prek-prompt-emoji">${vis.emoji}</span><span class="prek-prompt-label">${expected}</span>`;
          } else {
            targetEl.textContent = expected;
          }
        }
      } else {
        showToast('Almost — try again', 'warning');
        if (isPrek) encourageTryAgain();
        speak(expected).catch(() => {});
      }
    } catch (err) {
      heardEl.textContent = err.message || 'Could not hear you';
      showToast(heardEl.textContent, 'warning');
    } finally {
      micBtn.classList.remove('speaker-playing');
    }
  });

  loadItem();
}

export const speakWordActivity = {
  type: 'speak_word',
  label: 'Speak Words',
  render(ctx) {
    const words = /** @type {string[]} */ (ctx.lesson.content.words || [ctx.lesson.content.expectedText].filter(Boolean));
    renderSpeakingSession(ctx, {
      items: words,
      mode: 'word',
      getExpected: (w) => w,
      getLabel: (w, i, total) => `Say word ${i + 1} of ${total}`
    });
  }
};

export const speakSentenceActivity = {
  type: 'speak_sentence',
  label: 'Speak Sentences',
  render(ctx) {
    const sentences = /** @type {string[]} */ (
      ctx.lesson.content.sentences || [ctx.lesson.content.expectedText].filter(Boolean)
    );
    renderSpeakingSession(ctx, {
      items: sentences,
      mode: 'sentence',
      getExpected: (s) => s,
      getLabel: (_, i, total) => `Say sentence ${i + 1} of ${total}`
    });
  }
};

export const speakPassageActivity = {
  type: 'speak_passage',
  label: 'Read Aloud',
  render(ctx) {
    const text = /** @type {string} */ (ctx.lesson.content.expectedText || ctx.lesson.content.text || '');
    const phrases = text.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter(Boolean) || [text];
    renderSpeakingSession(ctx, {
      items: phrases,
      mode: 'passage',
      getExpected: (p) => p,
      getLabel: (_, i, total) => `Read phrase ${i + 1} of ${total}`
    });
  }
};

export const speakRepeatActivity = {
  type: 'speak_repeat',
  label: 'Repeat After Me',
  render(ctx) {
    ctx.lesson.content.maxAttempts = 2;
    const word = /** @type {string} */ (ctx.lesson.content.prompt || ctx.lesson.content.expectedText);
    renderSpeakingSession(ctx, {
      items: [word],
      mode: 'word',
      getExpected: () => word,
      getLabel: () => 'Repeat the word you hear'
    });
  }
};
