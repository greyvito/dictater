import { DictaterApp } from './App.js';

async function bootstrap() {
  const app = new DictaterApp();
  await app.init();
  window.dictaterApp = app;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}
