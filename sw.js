const CACHE_NAME = 'rba-v2';
const OFFLINE_URL = 'offline.html';

// Instala e guarda a página offline no cache do celular
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.add(OFFLINE_URL);
        })
    );
});

// Quando o navegador tenta carregar algo e falha (offline), ele entrega a página do cache
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
    }
});
