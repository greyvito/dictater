/** Full TTS engine manager — Web Speech, Puter, Kokoro, local server */

const TTS_SETTINGS_KEY = 'DICTATER_TTS_SETTINGS';

let rate = 1.0;
let engine = 'webspeech';
let voiceName = '';
let accent = 'US';

/** @type {SpeechSynthesisVoice[]} */
let webVoices = [];
/** Monotonic token — newer speakText calls cancel in-flight playback. */
let speakGeneration = 0;
/** @type {Promise<void>} */
let speakChain = Promise.resolve();
/** @type {HTMLAudioElement|null} */
let puterAudio = null;
/** @type {HTMLAudioElement|null} */
let kokoroAudio = null;
/** @type {HTMLAudioElement|null} */
let localAudio = null;
/** @type {unknown} */
let kokoroTts = null;
let kokoroLoading = null;

/** @type {((msg: string, type?: string) => void)|null} */
let toastFn = null;

export function setToastHandler(fn) {
  toastFn = fn;
}

function toast(msg, type = 'info') {
  if (toastFn) toastFn(msg, type);
  else console.warn('[TTS]', msg);
}

function loadTTSSettings() {
  try {
    const raw = localStorage.getItem(TTS_SETTINGS_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.engine) engine = saved.engine;
    if (saved.voiceName) voiceName = saved.voiceName;
    if (saved.accent) accent = saved.accent;
    if (saved.rate != null) rate = saved.rate;
  } catch {
    // ignore corrupt settings
  }
}

function saveTTSSettings() {
  try {
    localStorage.setItem(
      TTS_SETTINGS_KEY,
      JSON.stringify({ engine, voiceName, accent, rate })
    );
  } catch {
    // private browsing / quota
  }
}

loadTTSSettings();

export function setTTSOptions({ speed, voice, accentPref, engine: eng }) {
  if (speed != null) rate = speed;
  if (voice != null) voiceName = voice;
  if (accentPref != null) accent = accentPref;
  if (eng != null) engine = eng;
  saveTTSSettings();
}

export function getTTSOptions() {
  return { speed: rate, voice: voiceName, accent, engine };
}

export function loadVoices() {
  if (!window.speechSynthesis) return [];
  webVoices = window.speechSynthesis.getVoices();
  return webVoices;
}

function filterWebVoices() {
  if (!webVoices.length) loadVoices();
  const isUS = accent === 'US';
  let list = webVoices.filter((v) => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    if (isUS) return lang.startsWith('en-us');
    return lang.startsWith('en-gb') || lang.startsWith('en-au') || lang.startsWith('en-ie') || lang.startsWith('en-ca');
  });
  if (!list.length) list = webVoices.filter((v) => (v.lang || '').toLowerCase().startsWith('en'));
  return list.length ? list : webVoices;
}

const KOKORO_US = [
  { value: 'af_heart', name: 'Heart (US Female)' },
  { value: 'af_bella', name: 'Bella (US Female)' },
  { value: 'am_adam', name: 'Adam (US Male)' },
  { value: 'am_michael', name: 'Michael (US Male)' }
];
const KOKORO_UK = [
  { value: 'bf_emma', name: 'Emma (UK Female)' },
  { value: 'bf_isabella', name: 'Isabella (UK Female)' },
  { value: 'bm_george', name: 'George (UK Male)' }
];

const LOCAL_ENGINES = {
  'kokoro-mlx': ['af_heart', 'am_adam'],
  piper: ['en_US-lessac-medium', 'en_GB-alan-medium'],
  'f5-tts': ['default'],
  chatterbox: ['default']
};

export function getEngineList() {
  return [
    { value: 'webspeech', label: 'Native Web Speech API (Local & Free)' },
    { value: 'puter', label: 'Puter AI Voices (Cloud)' },
    { value: 'kokoro', label: 'Kokoro TTS (Local Neural)' },
    { value: 'kokoro-mlx', label: 'Local kokoro-mlx' },
    { value: 'piper', label: 'Local Piper TTS' },
    { value: 'f5-tts', label: 'Local F5-TTS' },
    { value: 'chatterbox', label: 'Local Chatterbox TTS' }
  ];
}

/** Populate voice & accent dropdowns in settings UI */
export function populateVoiceDropdowns() {
  const voiceSelect = document.querySelector('#voice-select');
  const voiceRow = document.querySelector('#voice-selection-row');
  const accentRow = document.querySelector('#accent-selection-row');
  if (!voiceSelect) return;

  voiceSelect.innerHTML = '';

  if (engine === 'webspeech') {
    voiceRow?.classList.remove('hidden');
    accentRow?.classList.remove('hidden');
    const list = filterWebVoices();
    if (!list.length) {
      voiceSelect.innerHTML = '<option value="">System Default</option>';
      return;
    }
    if (!voiceName || !list.some((v) => v.name === voiceName)) {
      voiceName = list[0]?.name || '';
    }
    list.forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      if (v.name === voiceName) opt.selected = true;
      voiceSelect.appendChild(opt);
    });
  } else if (engine === 'kokoro') {
    voiceRow?.classList.remove('hidden');
    accentRow?.classList.remove('hidden');
    const list = accent === 'US' ? KOKORO_US : KOKORO_UK;
    list.forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v.value;
      opt.textContent = v.name;
      if (v.value === voiceName || (!voiceName && v === list[0])) opt.selected = true;
      voiceSelect.appendChild(opt);
    });
    if (!voiceName) voiceName = list[0].value;
  } else if (LOCAL_ENGINES[engine]) {
    voiceRow?.classList.remove('hidden');
    accentRow?.classList.add('hidden');
    const voices = LOCAL_ENGINES[engine];
    if (!voiceName || !voices.includes(voiceName)) voiceName = voices[0];
    voices.forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      if (v === voiceName) opt.selected = true;
      voiceSelect.appendChild(opt);
    });
  } else if (engine === 'puter') {
    voiceRow?.classList.add('hidden');
    accentRow?.classList.remove('hidden');
  }
}

export function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  [puterAudio, kokoroAudio, localAudio].forEach((a) => {
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
  });
}

function ensureWebVoicesReady() {
  if (!window.speechSynthesis) return Promise.resolve();
  if (loadVoices().length) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', done);
      resolve();
    };
    window.speechSynthesis.addEventListener('voiceschanged', done);
    setTimeout(done, 400);
  });
}

function speakWebSpeech(text, generation) {
  return ensureWebVoicesReady().then(() => new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    if (generation !== speakGeneration) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    const voice = filterWebVoices().find((v) => v.name === voiceName) || filterWebVoices()[0];
    if (voice) utter.voice = voice;
    utter.onend = () => {
      if (generation === speakGeneration) resolve();
    };
    utter.onerror = (e) => {
      if (generation === speakGeneration) reject(e);
    };
    // Chrome/Safari often drop or repeat utterances if speak() follows cancel() immediately.
    setTimeout(() => {
      if (generation !== speakGeneration) return;
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utter);
    }, 50);
  }));
}

async function speakPuter(text, generation) {
  if (typeof puter === 'undefined' || window.puterLoadFailed) {
    toast('Cloud voices unavailable.', 'warning');
    throw new Error('Puter TTS unavailable');
  }
  if (generation !== speakGeneration) return;
  puterAudio = await puter.ai.txt2speech(text);
  if (generation !== speakGeneration) return;
  puterAudio.playbackRate = rate;
  puterAudio.dataset.text = text;
  return new Promise((resolve, reject) => {
    puterAudio.onended = () => {
      if (generation === speakGeneration) resolve();
    };
    puterAudio.onerror = () => {
      if (generation === speakGeneration) reject(new Error('Puter playback failed'));
    };
    puterAudio.play().catch(reject);
  });
}

function bufferToWav(buffer, sampleRate) {
  const len = buffer.length;
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const write = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  write(0, 'RIFF');
  view.setUint32(4, 36 + len * 2, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, 'data');
  view.setUint32(40, len * 2, true);
  const pcm = new Int16Array(len);
  for (let i = 0; i < len; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return new Blob([header, pcm], { type: 'audio/wav' });
}

async function initKokoro() {
  if (kokoroTts) return kokoroTts;
  if (kokoroLoading) return kokoroLoading;
  kokoroLoading = (async () => {
    toast('Loading Kokoro AI model (~82MB)...', 'info');
    const { KokoroTTS } = await import('https://esm.sh/kokoro-js');
    const device = navigator.gpu ? 'webgpu' : 'wasm';
    kokoroTts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
      dtype: 'q8',
      device
    });
    toast('Kokoro AI ready', 'success');
    return kokoroTts;
  })();
  return kokoroLoading;
}

async function speakKokoro(text, generation) {
  const tts = await initKokoro();
  if (!tts) throw new Error('Kokoro TTS unavailable');
  if (generation !== speakGeneration) return;
  const audio = await tts.generate(text, { voice: voiceName || 'af_heart' });
  if (generation !== speakGeneration) return;
  const url = URL.createObjectURL(bufferToWav(audio.audio, audio.sampling_rate));
  kokoroAudio = new Audio(url);
  kokoroAudio.playbackRate = rate;
  return new Promise((resolve, reject) => {
    kokoroAudio.onended = () => {
      URL.revokeObjectURL(url);
      if (generation === speakGeneration) resolve();
    };
    kokoroAudio.onerror = () => {
      if (generation === speakGeneration) reject(new Error('Kokoro playback failed'));
    };
    kokoroAudio.play().catch(reject);
  });
}

async function speakLocalServer(text, eng, generation) {
  if (generation !== speakGeneration) return;
  const url = `http://localhost:5002/tts?engine=${eng}&voice=${encodeURIComponent(voiceName)}&speed=${rate}&text=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const detail = res.status === 412 ? 'engine not installed on server' : `HTTP ${res.status}`;
    throw new Error(`Local TTS failed (${detail})`);
  }
  if (generation !== speakGeneration) return;
  const blob = await res.blob();
  if (generation !== speakGeneration) return;
  const objUrl = URL.createObjectURL(blob);
  localAudio = new Audio(objUrl);
  localAudio.playbackRate = rate;
  return new Promise((resolve, reject) => {
    localAudio.onended = () => {
      URL.revokeObjectURL(objUrl);
      if (generation === speakGeneration) resolve();
    };
    localAudio.onerror = () => {
      if (generation === speakGeneration) reject(new Error('Local TTS failed'));
    };
    localAudio.play().catch(reject);
  });
}

async function speakWithEngine(text, generation) {
  switch (engine) {
    case 'puter':
      return speakPuter(text, generation);
    case 'kokoro':
      return speakKokoro(text, generation);
    case 'kokoro-mlx':
    case 'piper':
    case 'f5-tts':
    case 'chatterbox':
      return speakLocalServer(text, engine, generation);
    default:
      return speakWebSpeech(text, generation);
  }
}

/** @returns {Promise<void>} */
export async function speakText(text) {
  if (!text?.trim()) return;
  speakGeneration += 1;
  const generation = speakGeneration;
  stopSpeech();

  const run = async () => {
    try {
      await speakWithEngine(text, generation);
    } catch (err) {
      if (generation !== speakGeneration) return;
      const isLocal = LOCAL_ENGINES[engine];
      if (isLocal) {
        toast('Local TTS server unavailable. Start it with: npm run tts', 'warning');
      } else {
        toast('Could not play audio', 'warning');
      }
      throw err;
    }
  };

  speakChain = speakChain.then(run, run);
  return speakChain;
}

export function splitIntoPhrases(text) {
  return text.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter(Boolean) || [text];
}

export function bindSettingsPanel() {
  const engineSelect = document.querySelector('#voice-engine');
  const accentSelect = document.querySelector('#voice-accent');
  const voiceSelect = document.querySelector('#voice-select');

  if (engineSelect && !engineSelect.dataset.bound) {
    engineSelect.dataset.bound = '1';
    getEngineList().forEach((e) => {
      const opt = document.createElement('option');
      opt.value = e.value;
      opt.textContent = e.label;
      if (e.value === engine) opt.selected = true;
      engineSelect.appendChild(opt);
    });
    engineSelect.addEventListener('change', (ev) => {
      engine = ev.target.value;
      saveTTSSettings();
      populateVoiceDropdowns();
    });
    engineSelect.value = engine;
  }

  accentSelect?.addEventListener('change', (ev) => {
    accent = ev.target.value;
    saveTTSSettings();
    populateVoiceDropdowns();
  });
  if (accentSelect) accentSelect.value = accent;

  voiceSelect?.addEventListener('change', (ev) => {
    voiceName = ev.target.value;
    saveTTSSettings();
  });

  populateVoiceDropdowns();
}
