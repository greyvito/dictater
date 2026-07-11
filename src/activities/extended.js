function mcqActivity(type, label, instruction) {
  return {
    type,
    label,
    render(ctx) {
      const { lesson, container, onComplete } = ctx;
      const questions = /** @type {Array<{ question: string, choices: string[], correctIndex: number }>} */ (
        lesson.content.questions || [lesson.content]
      );
      let qIdx = 0;
      let correct = 0;

      const renderQ = () => {
        const q = questions[qIdx];
        container.innerHTML = `
          <div class="comprehension-workspace">
            ${lesson.content.passage ? `<div class="original-peek mb-md">${lesson.content.passage}</div>` : ''}
            <p class="input-label">${instruction} (${qIdx + 1}/${questions.length})</p>
            <p class="speak-target-card">${q.question}</p>
            <div class="choice-grid" id="mcq-choices"></div>
          </div>`;
        const grid = container.querySelector('#mcq-choices');
        q.choices.forEach((choice, i) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'pill-btn choice-btn';
          btn.textContent = choice;
          btn.addEventListener('click', () => {
            if (i === q.correctIndex) correct++;
            qIdx++;
            if (qIdx >= questions.length) {
              const score = Math.round((correct / questions.length) * 100);
              container.innerHTML = `<div class="result-card feedback"><div class="result-score">${score}%</div><p>${correct} of ${questions.length} correct</p></div>`;
              onComplete({ score, passed: score >= 60 });
            } else renderQ();
          });
          grid.appendChild(btn);
        });
      };
      renderQ();
    }
  };
}

export const comprehensionActivity = mcqActivity('comprehension', 'Reading Comprehension', 'Answer the question');
export const grammarActivity = mcqActivity('grammar_fix', 'Grammar Fix-It', 'Choose the correct word');
export const vocabularyActivity = mcqActivity('vocabulary_context', 'Vocabulary in Context', 'Pick the best word');

export const phonicsBlendActivity = {
  type: 'phonics_blend',
  label: 'Phonics Blend',
  render(ctx) {
    const { lesson, container, onComplete } = ctx;
    const target = /** @type {string} */ (lesson.content.targetWord);
    const tiles = /** @type {string[]} */ (lesson.content.tiles || target.split(''));
    let selected = [];

    container.innerHTML = `
      <div class="phonics-workspace">
        <p class="input-label">Build the word: ${lesson.content.prompt || 'Blend the sounds'}</p>
        <div class="tile-bank" id="tile-bank"></div>
        <div class="tile-answer" id="tile-answer"></div>
        <button type="button" class="btn-accent" id="tile-check">Check</button>
      </div>`;

    const bank = container.querySelector('#tile-bank');
    const answer = container.querySelector('#tile-answer');

    const renderAnswer = () => {
      answer.innerHTML = '';
      selected.forEach((t, i) => {
        const span = document.createElement('button');
        span.type = 'button';
        span.className = 'pill-btn';
        span.textContent = t;
        span.addEventListener('click', () => {
          selected.splice(i, 1);
          renderAnswer();
          renderBank();
        });
        answer.appendChild(span);
      });
    };

    const renderBank = () => {
      bank.innerHTML = '';
      tiles.forEach((t, i) => {
        if (selected.includes(t) && selected.filter((x) => x === t).length >= tiles.filter((x) => x === t).length) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pill-btn';
        btn.textContent = t;
        btn.addEventListener('click', () => {
          selected.push(t);
          renderAnswer();
          renderBank();
        });
        bank.appendChild(btn);
      });
    };

    renderBank();
    container.querySelector('#tile-check').addEventListener('click', () => {
      const built = selected.join('');
      const score = built.toLowerCase() === target.toLowerCase() ? 100 : 0;
      onComplete({ score, passed: score === 100 });
    });
  }
};

export const sightWordActivity = {
  type: 'sight_word',
  label: 'Sight Words',
  render(ctx) {
    const words = /** @type {string[]} */ (ctx.lesson.content.words || []);
    ctx.lesson.content.questions = words.map((w) => ({
      question: `Which is the word "${w}"?`,
      choices: [w, ...words.filter((x) => x !== w).slice(0, 2)].sort(() => Math.random() - 0.5),
      correctIndex: 0
    }));
    words.forEach((w, i) => {
      ctx.lesson.content.questions[i].correctIndex = ctx.lesson.content.questions[i].choices.indexOf(w);
    });
    mcqActivity('sight_word', 'Sight Words', 'Find the sight word').render(ctx);
  }
};

export const sentenceBuilderActivity = {
  type: 'sentence_builder',
  label: 'Sentence Builder',
  render(ctx) {
    const { lesson, container, onComplete } = ctx;
    const target = /** @type {string} */ (lesson.content.sentence);
    const words = target.split(/\s+/);
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    let selected = [];

    container.innerHTML = `
      <div class="phonics-workspace">
        <p class="input-label">Put the words in order</p>
        <div class="tile-bank" id="sb-bank"></div>
        <div class="tile-answer" id="sb-answer"></div>
        <button type="button" class="btn-accent" id="sb-check">Check Sentence</button>
      </div>`;

    const bank = container.querySelector('#sb-bank');
    const answer = container.querySelector('#sb-answer');
    const used = new Set();

    const render = () => {
      answer.innerHTML = '';
      selected.forEach((w, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pill-btn';
        btn.textContent = w;
        btn.addEventListener('click', () => {
          selected.splice(i, 1);
          used.delete(w + i);
          render();
        });
        answer.appendChild(btn);
      });
      bank.innerHTML = '';
      shuffled.forEach((w, i) => {
        const key = w + i;
        if (selected.includes(w) && [...selected].filter((x) => x === w).length >= words.filter((x) => x === w).length) {
          if (selected.filter((x) => x === w).length >= words.filter((x) => x === w).length) return;
        }
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pill-btn';
        btn.textContent = w;
        btn.addEventListener('click', () => {
          selected.push(w);
          render();
        });
        bank.appendChild(btn);
      });
    };
    render();
    container.querySelector('#sb-check').addEventListener('click', () => {
      const built = selected.join(' ');
      const score = built.toLowerCase() === target.toLowerCase() ? 100 : 0;
      onComplete({ score, passed: score === 100 });
    });
  }
};

export const writingPromptActivity = {
  type: 'writing_prompt',
  label: 'Writing Prompt',
  render(ctx) {
    const { lesson, container, onComplete } = ctx;
    container.innerHTML = `
      <div class="writing-workspace">
        <p class="speak-target-card">${lesson.content.prompt}</p>
        <textarea id="write-prompt" class="dictation-input" placeholder="Write your answer here..."></textarea>
        <ul class="settings-note">${(lesson.content.checklist || ['Clear ideas', 'Complete sentences']).map((c) => `<li>${c}</li>`).join('')}</ul>
        <button type="button" class="btn-accent" id="write-done">Done</button>
      </div>`;
    container.querySelector('#write-done').addEventListener('click', () => {
      const text = container.querySelector('#write-prompt').value.trim();
      const wordCount = text ? text.split(/\s+/).length : 0;
      const min = lesson.content.minWords || 10;
      const score = wordCount >= min ? 100 : Math.round((wordCount / min) * 100);
      onComplete({ score, passed: wordCount >= min, details: { wordCount } });
    });
  }
};
