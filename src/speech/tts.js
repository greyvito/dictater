/** @typedef {{ speak: (text: string) => Promise<void>, stop: () => void, isSupported: () => boolean }} TTSEngine */

let rate = 1.0;
let voiceName = '';
let accent = 'US';
/** @type {SpeechSynthesisVoice[]} */
let voices = [];

export function setTTSOptions({ speed, voice, accentPref }) {
  if (speed != null) rate = speed;
  if (voice != null) voiceName = voice;
  if (accentPref != null) accent = accentPref;
}

export function loadVoices() {
  if (!window.speechSynthesis) return [];
  voices = window.speechSynthesis.getVoices().filter((v) => {
    const lang = v.lang.toLowerCase();
    if (accent === 'UK') return lang.includes('en-gb') || lang.includes('en-uk');
    return lang.includes('en-us') || lang.includes('en');
  });
  if (!voices.length) {
    voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
  }
  return voices;
}

export function getVoiceOptions() {
  return voices.map((v) => ({ name: v.name, lang: v.lang }));
}

/** @returns {Promise<void>} */
export function speakText(text) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;
    const voice = voices.find((v) => v.name === voiceName);
    if (voice) utter.voice = voice;
    utter.onend = () => resolve();
    utter.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utter);
  });
}

export function stopSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

export function splitIntoPhrases(text) {
  return text.match(/[^.!?]+[.!?]?/g)?.map((s) => s.trim()).filter(Boolean) || [text];
}
