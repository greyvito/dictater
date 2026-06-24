const CACHE_NAME = 'dictater-v5';
const FONT_CACHE_NAME = 'dictater-fonts-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './index.css',
  './app.js',
  './manifest.json',
  './images/icon.svg',
  './curriculum/gradeK.js',
  './curriculum/grade1.js',
  './curriculum/grade2.js',
  './curriculum/grade3.js',
  './curriculum/grade4.js',
  './curriculum/grade5.js',
  './curriculum/grade6.js'
];

// Domains eligible for runtime font caching
const FONT_ORIGINS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// Install Event — Caching assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell and Curriculums');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event — Clean up old caches
self.addEventListener('activate', (event) => {
  const validCaches = [CACHE_NAME, FONT_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!validCaches.includes(cache)) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event — Offline capabilities
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Google Fonts — Cache-First (fonts rarely change)
  if (FONT_ORIGINS.some(origin => url.hostname.includes(origin))) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(FONT_CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Local assets — Network-First with cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network request fails (e.g. offline), fallback to cache
          return caches.match(event.request);
        })
    );
  }
});

