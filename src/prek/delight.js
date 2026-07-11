/** PreK delight: mascot reactions, confetti, and gentle sound effects */

let audioCtx = null;

function getAudio() {
  if (!audioCtx && typeof AudioContext !== 'undefined') {
    try {
      audioCtx = new AudioContext();
    } catch {
      /* ignore */
    }
  }
  return audioCtx;
}

/** @param {number} freq @param {number} duration @param {string} type */
function tone(freq, duration, type = 'sine') {
  const ctx = getAudio();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playSuccessSound() {
  tone(523, 0.12);
  setTimeout(() => tone(659, 0.12), 90);
  setTimeout(() => tone(784, 0.18), 180);
}

export function playTryAgainSound() {
  tone(330, 0.2, 'triangle');
}

const MASCOT_SVG = `<svg class="prek-mascot-svg" viewBox="0 0 100 100" aria-hidden="true">
  <ellipse cx="50" cy="58" rx="38" ry="34" fill="#7EC8E3"/>
  <ellipse cx="50" cy="52" rx="32" ry="28" fill="#A8D8EA"/>
  <circle cx="36" cy="44" r="14" fill="#A8D8EA"/>
  <circle cx="64" cy="44" r="14" fill="#A8D8EA"/>
  <circle cx="36" cy="44" r="8" fill="#fff"/>
  <circle cx="64" cy="44" r="8" fill="#fff"/>
  <circle cx="38" cy="44" r="4" fill="#2D3748"/>
  <circle cx="66" cy="44" r="4" fill="#2D3748"/>
  <ellipse cx="50" cy="58" rx="8" ry="5" fill="#FFB347"/>
  <path d="M42 66 Q50 74 58 66" stroke="#2D3748" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path class="prek-mascot-wing prek-mascot-wing--l" d="M12 55 Q4 45 14 38" stroke="#5EBAD6" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path class="prek-mascot-wing prek-mascot-wing--r" d="M88 55 Q96 45 86 38" stroke="#5EBAD6" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

/** @param {HTMLElement | null} host */
export function mountMascot(host) {
  if (!host || host.querySelector('.prek-mascot')) return;
  const el = document.createElement('div');
  el.className = 'prek-mascot';
  el.innerHTML = `${MASCOT_SVG}<p class="prek-mascot-speech">Let's play!</p>`;
  el.setAttribute('aria-hidden', 'true');
  host.appendChild(el);
}

/** @param {'idle' | 'happy' | 'sad' | 'celebrate'} mood @param {string} [message] */
export function setMascotMood(mood, message) {
  const mascot = document.querySelector('.prek-mascot');
  if (!mascot) return;
  mascot.classList.remove('prek-mascot--happy', 'prek-mascot--sad', 'prek-mascot--celebrate');
  if (mood === 'happy' || mood === 'celebrate') mascot.classList.add(`prek-mascot--${mood}`);
  if (mood === 'sad') mascot.classList.add('prek-mascot--sad');
  const speech = mascot.querySelector('.prek-mascot-speech');
  if (speech && message) speech.textContent = message;
}

/** @param {HTMLElement} container */
export function launchConfetti(container) {
  const layer = document.createElement('div');
  layer.className = 'prek-confetti-layer';
  layer.setAttribute('aria-hidden', 'true');
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8E72', '#C77DFF', '#FF85A1'];
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('span');
    p.className = 'prek-confetti-piece';
    p.style.background = colors[i % colors.length];
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDelay = `${Math.random() * 0.4}s`;
    p.style.animationDuration = `${0.9 + Math.random() * 0.8}s`;
    layer.appendChild(p);
  }
  container.appendChild(layer);
  setTimeout(() => layer.remove(), 2200);
}

export function celebrateCorrect(container) {
  playSuccessSound();
  launchConfetti(container);
  setMascotMood('celebrate', 'Great job! 🌟');
  setTimeout(() => setMascotMood('idle', "Let's play!"), 2500);
}

export function encourageTryAgain() {
  playTryAgainSound();
  setMascotMood('sad', 'Try again!');
  setTimeout(() => setMascotMood('idle', "You can do it!"), 1800);
}
