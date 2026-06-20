const CACHE_NAME = 'dictater-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './index.css',
  './app.js',
  './manifest.json',
  './images/icon.svg',
  './curriculum/grade3.js',
  './curriculum/grade4.js',
  './curriculum/grade5.js',
  './curriculum/grade6.js'
];

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
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event — Offline capabilities (Cache-first approach)
self.addEventListener('fetch', (event) => {
  // Only handle standard GET requests for our local app domain (ignore puter API calls or external fonts)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache new static requests on the fly
        if (response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});
