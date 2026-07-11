/** Full TTS engine manager — Web Speech, Puter, Kokoro, local server */

let rate = 1.0;
let engine = 'webspeech';
let voiceName = '';
let accent = 'US';

/** @type {SpeechSynthesisVoice[]} */
let webVoices = [];
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

export function setTTSOptions({ speed, voice, accentPref, engine: eng }) {
  if (speed != null) rate = speed;
  if (voice != null) voiceName = voice;
  if (accentPref != null) accent = accentPref;
  if (eng != null) engine = eng;
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
    LOCAL_ENGINES[engine].forEach((v) => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      voiceSelect.appendChild(opt);
    });
    voiceName = LOCAL_ENGINES[engine][0];
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

function speakWebSpeech(text) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    const voice = filterWebVoices().find((v) => v.name === voiceName) || filterWebVoices()[0];
    if (voice) utter.voice = voice;
    utter.onend = () => resolve();
    utter.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utter);
  });
}

async function speakPuter(text) {
  if (typeof puter === 'undefined' || window.puterLoadFailed) {
    toast('Cloud voices unavailable — using local engine.', 'warning');
    engine = 'webspeech';
    document.querySelector('#voice-engine').value = 'webspeech';
    populateVoiceDropdowns();
    return speakWebSpeech(text);
  }
  stopSpeech();
  puterAudio = await puter.ai.txt2speech(text);
  puterAudio.playbackRate = rate;
  puterAudio.dataset.text = text;
  return new Promise((resolve, reject) => {
    puterAudio.onended = () => resolve();
    puterAudio.onerror = () => reject(new Error('Puter playback failed'));
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

async function speakKokoro(text) {
  const tts = await initKokoro();
  if (!tts) return speakWebSpeech(text);
  stopSpeech();
  const audio = await tts.generate(text, { voice: voiceName || 'af_heart' });
  const url = URL.createObjectURL(bufferToWav(audio.audio, audio.sampling_rate));
  kokoroAudio = new Audio(url);
  kokoroAudio.playbackRate = rate;
  return new Promise((resolve, reject) => {
    kokoroAudio.onended = () => { URL.revokeObjectURL(url); resolve(); };
    kokoroAudio.onerror = () => reject(new Error('Kokoro playback failed'));
    kokoroAudio.play().catch(reject);
  });
}

async function speakLocalServer(text, eng) {
  stopSpeech();
  const url = `http://localhost:5002/tts?engine=${eng}&voice=${encodeURIComponent(voiceName)}&speed=${rate}&text=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    localAudio = new Audio(objUrl);
    localAudio.playbackRate = rate;
    return new Promise((resolve, reject) => {
      localAudio.onended = () => { URL.revokeObjectURL(objUrl); resolve(); };
      localAudio.onerror = () => reject(new Error('Local TTS failed'));
      localAudio.play().catch(reject);
    });
  } catch (e) {
    toast('Local TTS server unavailable — using Web Speech.', 'warning');
    engine = 'webspeech';
    document.querySelector('#voice-engine').value = 'webspeech';
    populateVoiceDropdowns();
    return speakWebSpeech(text);
  }
}

/** @returns {Promise<void>} */
export async function speakText(text) {
  if (!text?.trim()) return;
  switch (engine) {
    case 'puter':
      return speakPuter(text);
    case 'kokoro':
      return speakKokoro(text);
    case 'kokoro-mlx':
    case 'piper':
    case 'f5-tts':
    case 'chatterbox':
      return speakLocalServer(text, engine);
    default:
      return speakWebSpeech(text);
  }
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
      populateVoiceDropdowns();
    });
  }

  accentSelect?.addEventListener('change', (ev) => {
    accent = ev.target.value;
    populateVoiceDropdowns();
  });

  voiceSelect?.addEventListener('change', (ev) => {
    voiceName = ev.target.value;
  });

  populateVoiceDropdowns();
}
