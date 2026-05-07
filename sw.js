/* ============================================
   Naval Books Tracker — Service Worker
   Provides offline support & caching
   ============================================ */

const CACHE_NAME = 'naval-books-v1';
const ASSETS_TO_CACHE = [
  '.',
  'index.html',
  'css/style.css',
  'js/app.js',
  'manifest.json',
  'favicon.svg',
  'images/thinker-cutout.png'
];

// Install: cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then(response => {
            // Cache successful responses for future
            if (response && response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => {
            // Offline fallback for image requests
            if (event.request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="92" height="132"><rect fill="#2b1f19" width="92" height="132"/><text x="46" y="66" text-anchor="middle" fill="#bea892" font-size="10">離線</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            return caches.match('.');
          });
      })
  );
});
