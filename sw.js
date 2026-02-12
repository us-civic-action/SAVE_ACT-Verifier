const CACHE_NAME = 'save-act-verifier-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './index.css',
    './manifest.json'
];

// Install event: Cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event: Network first, fallback to cache (Stale-while-revalidate strategy)
// Fetch event: Network first, fallback to cache (Stale-while-revalidate strategy)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone the response to store in cache
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(async () => {
                // Fallback to cache if network fails
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Return a fallback response for offline misses
                return new Response('Offline: Resource not found', { status: 404, statusText: 'Not Found' });
            })
    );
});
