#!/usr/bin/env node
/** Start dev + API + optional Whisper for full local laptop experience */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const speechDir = path.join(__dirname, '..', 'speech-server');
const venvPython =
  process.platform === 'win32'
    ? path.join(speechDir, '.venv', 'Scripts', 'python.exe')
    : path.join(speechDir, '.venv', 'bin', 'python');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];

function run(name, cmd, args, opts = {}) {
  const child = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts });
  children.push(child);
  return child;
}

console.log('');
console.log('  Dictater — full local mode (app + API + Whisper)');
console.log('  ────────────────────────────────────────────────');
console.log('  Student app:  http://localhost:5173');
console.log('  API:          http://localhost:3001');
console.log('  Whisper:      http://localhost:3002');
console.log('');

run('backend', npmCmd, ['run', 'backend']);
run('dev', npmCmd, ['run', 'dev']);

if (fs.existsSync(venvPython)) {
  run('whisper', npmCmd, ['run', 'whisper']);
} else {
  console.log('  ⚠ Whisper venv not found — speaking uses browser STT only.');
  console.log('    Setup: cd speech-server && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt');
  console.log('');
}

function shutdown() {
  children.forEach((c) => c.kill('SIGTERM'));
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
