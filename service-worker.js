const CACHE_NAME = "calculateur-expedition-v1";

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

    );

});


self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys().then(function(nomsCaches) {

            return Promise.all(

                nomsCaches
                    .filter(function(nom) {

                        return nom !== CACHE_NAME;

                    })
                    .map(function(nom) {

                        return caches.delete(nom);

                    })

            );

        })

    );

});


self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request)
            .then(function(reponse) {

                return reponse ||
                    fetch(event.request);

            })

    );

});