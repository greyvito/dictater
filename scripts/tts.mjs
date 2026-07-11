#!/usr/bin/env node
/**
 * Start the local TTS server (Kokoro MLX, Piper, etc.) on port 5002.
 * Requires: python3 -m venv venv && venv/bin/pip install kokoro-mlx soundfile mlx piper-tts
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const port = process.env.TTS_PORT || '5002';

const venvPython =
  process.platform === 'win32'
    ? path.join(root, 'venv', 'Scripts', 'python.exe')
    : path.join(root, 'venv', 'bin', 'python');

if (!fs.existsSync(venvPython)) {
  console.error('');
  console.error('  TTS venv not found. One-time setup:');
  console.error('');
  console.error('    python3 -m venv venv');
  console.error('    source venv/bin/activate');
  console.error('    pip install kokoro-mlx soundfile mlx piper-tts');
  console.error('');
  console.error('  Then run: npm run tts');
  console.error('');
  process.exit(1);
}

console.log(`Starting TTS server on http://127.0.0.1:${port}`);

const child = spawn(venvPython, ['tts_server.py'], { cwd: root, stdio: 'inherit' });

child.on('exit', (code) => process.exit(code ?? 0));
