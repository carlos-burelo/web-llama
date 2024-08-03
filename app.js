const CACHE_NAME = 'coatl-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/index.html',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/main.js',
    '/libs/snarkdown.js',
    '/libs/webllm.js'
];


self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                console.log('Abriendo caché');
                try {
                    await Promise.all(
                        urlsToCache.map(async (url) => {
                            const response = await cache.match(url);
                            if (!response) {
                                await cache.add(url);
                            }
                        })
                    );
                    console.log('Archivos cacheados con éxito');
                } catch (error) {
                    console.error('Error en la instalación del Service Worker:', error);
                }
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(async (cacheNames) => {
            await Promise.all(
                cacheNames.map(async (cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        await caches.delete(cacheName);
                    }
                })
            );
        })
    );
});