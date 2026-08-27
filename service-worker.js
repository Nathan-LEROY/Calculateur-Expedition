const CACHE_NAME = "calculateur-expedition-v2";

const FICHIERS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

self.addEventListener("install", function(event) {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(FICHIERS);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );

});

self.addEventListener("activate", function(event) {

    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {

                return Promise.all(
                    cacheNames.map(function(cacheName) {

                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }

                    })
                );

            })
            .then(function() {
                return self.clients.claim();
            })
    );

});

self.addEventListener("fetch", function(event) {

    event.respondWith(

        fetch(event.request)
            .then(function(response) {
                return response;
            })
            .catch(function() {
                return caches.match(event.request);
            })

    );

});
