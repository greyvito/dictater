/** Record microphone audio via MediaRecorder */

/** @returns {Promise<boolean>} */
export function isRecordingSupported() {
  return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
}

/**
 * @param {number} maxMs
 * @returns {Promise<Blob>}
 */
export function recordAudio(maxMs = 8000) {
  return new Promise(async (resolve, reject) => {
    if (!isRecordingSupported()) {
      reject(new Error('Microphone recording not supported'));
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      reject(new Error('Microphone permission denied'));
      return;
    }

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : '';

    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };

    recorder.onerror = () => {
      stream.getTracks().forEach((t) => t.stop());
      reject(new Error('Recording failed'));
    };

    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const type = recorder.mimeType || 'audio/webm';
      resolve(new Blob(chunks, { type }));
    };

    recorder.start();
    setTimeout(() => {
      if (recorder.state === 'recording') recorder.stop();
    }, maxMs);
  });
}

/** @param {'word' | 'sentence' | 'passage'} mode */
export function recordDurationForMode(mode) {
  if (mode === 'word') return 4500;
  if (mode === 'passage') return 15000;
  return 9000;
}
