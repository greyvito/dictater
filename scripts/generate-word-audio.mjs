#!/usr/bin/env node
/**
 * Pre-generate TTS audio for all topical vocabulary words (word_intro).
 * Requires local TTS server: npm run tts (kokoro-mlx or piper).
 *
 * Usage:
 *   npm run tts          # in another terminal
 *   npm run generate:word-audio
 *   npm run generate:word-audio -- --engine piper --voice en_US-lessac-medium
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { allTopicWords } from './prek-topics.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public', 'audio', 'words');
const port = process.env.TTS_PORT || '5002';

const args = process.argv.slice(2);
const engine = args.includes('--engine')
  ? args[args.indexOf('--engine') + 1]
  : 'piper';
const voice = args.includes('--voice')
  ? args[args.indexOf('--voice') + 1]
  : 'en_US-lessac-medium';
const force = args.includes('--force');

/** @param {string} word */
function slugForWord(word) {
  return String(word)
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

async function ttsAvailable() {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/status`);
    return res.ok;
  } catch {
    return false;
  }
}

/** @param {string} text */
async function synthesize(text) {
  const url = `http://127.0.0.1:${port}/tts?engine=${encodeURIComponent(engine)}&voice=${encodeURIComponent(voice)}&speed=1&text=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`TTS HTTP ${res.status}: ${detail}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  if (!(await ttsAvailable())) {
    console.error('');
    console.error('  Local TTS server not running on port', port);
    console.error('  Start it first: npm run tts');
    console.error('');
    process.exit(1);
  }

  fs.mkdirSync(outDir, { recursive: true });
  const words = allTopicWords();
  const manifest = { engine, voice, words: [] };
  let created = 0;
  let skipped = 0;

  for (const word of words) {
    const slug = slugForWord(word);
    if (!slug) continue;
    const outPath = path.join(outDir, `${slug}.wav`);

    if (!force && fs.existsSync(outPath)) {
      manifest.words.push(slug);
      skipped += 1;
      continue;
    }

    process.stdout.write(`  ${word} → ${slug}.wav ... `);
    try {
      const wav = await synthesize(word);
      fs.writeFileSync(outPath, wav);
      manifest.words.push(slug);
      created += 1;
      console.log('ok');
    } catch (err) {
      console.log('FAILED');
      console.error(`    ${err.message}`);
    }
  }

  manifest.words.sort();
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('');
  console.log(`  Generated ${created} new files, skipped ${skipped} existing`);
  console.log(`  Total cached words: ${manifest.words.length}`);
  console.log(`  Output: public/audio/words/`);
  console.log('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
