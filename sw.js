// sw.js
const CACHE_NAME = 'korean-learning-hub-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  // Note: Caching opaque responses from CDNs can be unreliable.
  // This is a best-effort attempt for the demo environment.
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/',
  'https://aistudiocdn.com/@google/genai@^1.21.0'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use addAll with a catch to prevent a single failed asset from breaking the entire cache
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache one or more resources during install:', error);
        });
      })
  );
});

self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || (response.status !== 200 && response.status !== 0) || response.type === 'error') {
              return response;
            }

            // We don't cache our mock API calls, which are POST/DELETE/internal GETs
            // This condition is a simple way to avoid caching dynamic data fetches.
            if (event.request.url.includes('/api/')) {
              return response;
            }
            
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(error => {
            console.log('Fetch failed; returning offline page instead.', error);
            // Optional: return a fallback offline page
            // return caches.match('/offline.html');
        });
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
