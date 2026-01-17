const CACHE_NAME = 'rba-v3'; // Versão 3 para atualizar o cache
const ASSETS_TO_CACHE = [
    'offline.html',
    'logo.png',         // Certifique-se que o nome está idêntico ao arquivo
    'icone-app.png',    // O ícone usado no jogo
    'indexapp.html'        // Salva a página principal para evitar tela branca
];

// INSTALAÇÃO: Guarda tudo o que é essencial no celular
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('RBA: Guardando arquivos para uso offline...');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// ATIVAÇÃO: Limpa versões antigas do app (v1, v2) para não ocupar espaço
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

// BUSCA (FETCH): A mágica acontece aqui
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            // Se a internet falhar, ele tenta buscar o que foi pedido no cache
            return caches.match(event.request).then((response) => {
                if (response) {
                    return response;
                }
                // Se for uma navegação de página e não tiver no cache, mostra o jogo offline
                if (event.request.mode === 'navigate') {
                    return caches.match('offline.html');
                }
            });
        })
    );
});
