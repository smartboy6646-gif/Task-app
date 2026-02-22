const CACHE_NAME = 'esports-v1';
const ASSETS = ['/', '/index.html', '/css/styles.css', '/js/firebase.js', '/js/player.js'];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});
