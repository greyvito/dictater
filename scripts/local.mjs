#!/usr/bin/env node
/**
 * Start Dictater for local laptop use (dev frontend + API).
 * Usage: npm run local
 */
import { spawn } from 'child_process';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(name, script) {
  const child = spawn(npmCmd, ['run', script], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
  child.on('exit', (code) => {
    if (code && code !== 0) console.error(`[local] ${name} exited with code ${code}`);
  });
  return child;
}

console.log('');
console.log('  Dictater — local laptop mode');
console.log('  ─────────────────────────────');
console.log('  Student app:  http://localhost:5173');
console.log('  Teacher portal: http://localhost:5173/teacher.html');
console.log('  API:          http://localhost:3001');
console.log('');
console.log('  Use Chrome for speaking activities (microphone).');
console.log('  Press Ctrl+C to stop both servers.');
console.log('');

const backend = run('backend', 'backend');
const dev = run('dev', 'dev');

function shutdown() {
  backend.kill('SIGTERM');
  dev.kill('SIGTERM');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
