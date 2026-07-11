function choiceActivity(type, label, renderFn) {
  return { type, label, render: renderFn };
}

function renderChoices(ctx, config) {
  const { lesson, container, speak, onComplete, showToast } = ctx;
  const { prompt, choices, correctIndex, instruction } = config;
  let answered = false;

  container.innerHTML = `
    <div class="prek-activity">
      <p class="input-label">${instruction}</p>
      <div class="speak-target-card" id="prek-prompt">${prompt}</div>
      <button type="button" class="btn-secondary btn-compact" id="prek-listen">Listen</button>
      <div class="choice-grid" id="prek-choices"></div>
      <div id="prek-feedback" class="result-card feedback hidden"></div>
    </div>`;

  const choicesEl = container.querySelector('#prek-choices');
  choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill-btn choice-btn';
    btn.textContent = choice;
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const correct = i === correctIndex;
      btn.classList.add(correct ? 'choice-correct' : 'choice-wrong');
      const fb = container.querySelector('#prek-feedback');
      fb.textContent = correct ? 'Correct!' : `Try again next time. The answer is "${choices[correctIndex]}".`;
      fb.classList.remove('hidden');
      onComplete({ score: correct ? 100 : 0, passed: correct });
    });
    choicesEl.appendChild(btn);
  });

  container.querySelector('#prek-listen').addEventListener('click', () => {
    speak(prompt).catch(() => showToast('Audio unavailable', 'warning'));
  });
  speak(prompt).catch(() => {});
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
      instruction: 'Which word rhymes?'
    });
  }
};

export const syllableActivity = {
  type: 'phonological_syllable',
  label: 'Syllable Count',
  render(ctx) {
    const c = ctx.lesson.content;
    const prompt = c.prompt;
    const choices = c.choices || ['1', '2', '3'];
    const correctIndex = c.correctIndex ?? 0;
    renderChoices(ctx, {
      prompt,
      choices: choices.map((n) => `${n} clap${n === '1' ? '' : 's'}`),
      correctIndex,
      instruction: 'How many syllables? Clap along, then choose.'
    });
  }
};

export const initialSoundActivity = {
  type: 'phonological_initial',
  label: 'Beginning Sound',
  render(ctx) {
    const c = ctx.lesson.content;
    renderChoices(ctx, {
      prompt: c.prompt,
      choices: c.choices,
      correctIndex: c.correctIndex,
      instruction: 'What sound does it start with?'
    });
  }
};

export const letterSoundActivity = {
  type: 'letter_sound',
  label: 'Letter Sound Match',
  render(ctx) {
    const c = ctx.lesson.content;
    renderChoices(ctx, {
      prompt: `Letter ${c.letter}`,
      choices: c.choices,
      correctIndex: c.correctIndex,
      instruction: 'Which picture starts with this letter sound?'
    });
  }
};

export const pictureVocabActivity = {
  type: 'picture_vocab',
  label: 'Picture Vocabulary',
  render(ctx) {
    const c = ctx.lesson.content;
    renderChoices(ctx, {
      prompt: c.prompt,
      choices: c.choices,
      correctIndex: c.correctIndex,
      instruction: 'Tap the word you hear.'
    });
  }
};
