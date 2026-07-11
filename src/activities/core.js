import { renderDiffToContainer, alignWords, scoreAlignment, splitIntoWords } from '../grading/wordDiff.js';
import { splitIntoPhrases, speakText } from '../speech/tts.js';

function appendPostCheckActions(parent, ctx, score, passed = true) {
  const { retryLesson, loadNextLesson } = ctx;
  if (!retryLesson && !loadNextLesson) return;

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
    retry.textContent = 'Try again';
    retry.addEventListener('click', () => retryLesson());
    row.appendChild(retry);
  }
  if (loadNextLesson && passed) {
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'btn-primary btn-compact';
    next.textContent = 'Next lesson';
    next.addEventListener('click', () => loadNextLesson());
    row.appendChild(next);
  }
}

export const dictationActivity = {
  type: 'dictation',
  label: 'Passage Dictation',
  render(ctx) {
    const { lesson, container, onComplete, showToast } = ctx;
    const text = /** @type {string} */ (lesson.content.text || '');
    const phrases = splitIntoPhrases(text);
    let phraseIdx = 0;

    container.innerHTML = `
      <div class="writing-workspace">
        <div class="input-section">
          <div class="workout-header">
            <h4 class="input-label">Your Writing Area</h4>
            <p class="word-count-label" id="dict-word-count">Words: 0</p>
          </div>
          <textarea id="dict-input" class="dictation-input" placeholder="Listen, then write what you hear..."></textarea>
        </div>
        <div class="phrase-nav mt-sm">
          <button type="button" class="pill-btn btn-compact-sm" id="dict-prev">← Prev Phrase</button>
          <button type="button" class="btn-primary btn-compact-sm" id="dict-play">Play Phrase</button>
          <button type="button" class="pill-btn btn-compact-sm" id="dict-next">Next Phrase →</button>
          <span class="phrase-progress" id="dict-progress">Phrase 1 of ${phrases.length}</span>
        </div>
        <p class="settings-note phrase-hint">Phrase navigation replays audio — write the full passage in the box above.</p>
        <div class="actions-row">
          <button type="button" class="btn-secondary" id="dict-clear">Clear</button>
          <button type="button" class="btn-primary" id="dict-check">Check My Answer</button>
        </div>
        <div id="dict-results" class="result-card feedback hidden">
          <div class="result-header">
            <h3 class="section-title section-title--plain">Evaluation Results</h3>
            <div id="dict-score" class="result-score">0%</div>
          </div>
          <div id="dict-diff" class="diff-container"></div>
        </div>
      </div>`;

    const input = container.querySelector('#dict-input');
    const countEl = container.querySelector('#dict-word-count');
    const progressEl = container.querySelector('#dict-progress');

    const updateCount = () => {
      const t = input.value.trim();
      countEl.textContent = `Words: ${t ? t.split(/\s+/).length : 0}`;
    };
    input.addEventListener('input', updateCount);

    const updateProgress = () => {
      progressEl.textContent = `Phrase ${phraseIdx + 1} of ${phrases.length}`;
    };

    container.querySelector('#dict-play').addEventListener('click', () => {
      speakText(phrases[phraseIdx]).catch(() => showToast('Could not play audio', 'error'));
    });
    container.querySelector('#dict-prev').addEventListener('click', () => {
      phraseIdx = Math.max(0, phraseIdx - 1);
      updateProgress();
    });
    container.querySelector('#dict-next').addEventListener('click', () => {
      phraseIdx = Math.min(phrases.length - 1, phraseIdx + 1);
      updateProgress();
    });
    container.querySelector('#dict-clear').addEventListener('click', () => {
      input.value = '';
      updateCount();
      container.querySelector('#dict-results').classList.add('hidden');
    });
    container.querySelector('#dict-check').addEventListener('click', () => {
      const typed = input.value.trim();
      if (!typed) {
        showToast('Write something before checking!', 'warning');
        return;
      }
      const orig = splitIntoWords(text);
      const typedWords = splitIntoWords(typed);
      const alignment = alignWords(orig, typedWords);
      const score = scoreAlignment(alignment, orig.length);
      const passed = score >= 70;
      const results = container.querySelector('#dict-results');
      renderDiffToContainer(container.querySelector('#dict-diff'), alignment);
      container.querySelector('#dict-score').textContent = `${score}% Accuracy`;
      results.classList.remove('hidden');
      appendPostCheckActions(results, ctx, score, passed);
      onComplete({ score, passed, details: { alignment } });
    });
  }
};

export const spellingActivity = {
  type: 'spelling',
  label: 'Word Spelling',
  render(ctx) {
    const { lesson, container, speak, onComplete, showToast } = ctx;
    const words = /** @type {string[]} */ (lesson.content.words || []);
    let idx = 0;
    const history = [];

    container.innerHTML = `
      <div class="spelling-workspace">
        <h4 class="input-label">Spell the word you hear</h4>
        <p class="progress-label">Progress: <strong id="spell-progress">Word 1 of ${words.length}</strong></p>
        <input type="text" id="spell-input" class="dictation-input dictation-input--spelling" autocomplete="off" spellcheck="false" placeholder="Type the word...">
        <div class="actions-row">
          <button type="button" class="btn-secondary btn-compact" id="spell-play">Play Word</button>
          <button type="button" class="btn-secondary btn-compact" id="spell-skip">Skip</button>
          <button type="button" class="btn-primary btn-compact" id="spell-submit">Submit</button>
        </div>
        <div id="spell-results" class="result-card feedback hidden">
          <div class="result-header">
            <h3 class="section-title section-title--plain">Spelling Summary</h3>
            <div id="spell-score" class="result-score"></div>
          </div>
          <div id="spell-diff" class="diff-container"></div>
        </div>
      </div>`;

    const input = container.querySelector('#spell-input');
    const progress = container.querySelector('#spell-progress');

    const playCurrent = () => speak(words[idx]).catch(() => showToast('Audio unavailable', 'warning'));
    const finish = () => {
      const correct = history.filter((h) => h.correct).length;
      const score = Math.round((correct / words.length) * 100);
      const passed = score >= 70;
      const results = container.querySelector('#spell-results');
      container.querySelector('#spell-score').textContent = `${correct} / ${words.length} Correct`;
      const diffEl = container.querySelector('#spell-diff');
      diffEl.innerHTML = '';
      history.forEach((h) => {
        const row = document.createElement('div');
        row.className = 'activity-log-entry';
        row.innerHTML = `<span>${h.word}</span><span class="${h.correct ? 'score-high' : 'score-low'}">${h.correct ? '✓' : h.typed || '—'}</span>`;
        diffEl.appendChild(row);
      });
      results.classList.remove('hidden');
      appendPostCheckActions(results, ctx, score, passed);
      onComplete({ score, passed, details: { history } });
    };

    const submit = () => {
      const typed = input.value.trim();
      const correct = typed.toLowerCase() === words[idx].toLowerCase();
      history.push({ word: words[idx], typed, correct });
      idx++;
      input.value = '';
      if (idx >= words.length) finish();
      else {
        progress.textContent = `Word ${idx + 1} of ${words.length}`;
        playCurrent();
        input.focus();
      }
    };

    container.querySelector('#spell-play').addEventListener('click', playCurrent);
    container.querySelector('#spell-skip').addEventListener('click', () => {
      history.push({ word: words[idx], typed: null, correct: false });
      idx++;
      if (idx >= words.length) finish();
      else {
        progress.textContent = `Word ${idx + 1} of ${words.length}`;
        playCurrent();
      }
    });
    container.querySelector('#spell-submit').addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    });
    playCurrent();
    input.focus();
  }
};
