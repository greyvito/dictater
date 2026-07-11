#!/usr/bin/env node
/**
 * Start the local Whisper speech server (Python + faster-whisper).
 * Run once: cd speech-server && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const speechDir = path.join(root, 'speech-server');
const port = process.env.WHISPER_PORT || '3002';

const venvPython =
  process.platform === 'win32'
    ? path.join(speechDir, '.venv', 'Scripts', 'python.exe')
    : path.join(speechDir, '.venv', 'bin', 'python');

if (!fs.existsSync(venvPython)) {
  console.error('');
  console.error('  Whisper venv not found. One-time setup:');
  console.error('');
  console.error('    cd speech-server');
  console.error('    python3 -m venv .venv');
  console.error('    .venv/bin/pip install -r requirements.txt   # Windows: .venv\\Scripts\\pip');
  console.error('');
  console.error('  Then run: npm run whisper');
  console.error('');
  process.exit(1);
}

console.log(`Starting Whisper on http://127.0.0.1:${port} (model: ${process.env.WHISPER_MODEL || 'tiny'})`);

const child = spawn(
  venvPython,
  ['-m', 'uvicorn', 'server:app', '--host', '127.0.0.1', '--port', port],
  { cwd: speechDir, stdio: 'inherit' }
);

child.on('exit', (code) => process.exit(code ?? 0));
