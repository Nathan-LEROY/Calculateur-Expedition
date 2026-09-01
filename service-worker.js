// ==========================================
// SERVICE WORKER
// CALCULATEUR D'EXPÉDITION
// ==========================================


const CACHE_NAME =
    "calculateur-expedition-v3";


const FICHIERS =
    [
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./manifest.json"
    ];


// ==========================================
// INSTALLATION
// ==========================================

self.addEventListener(
    "install",
    function(event) {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(
                function(cache) {

                    return cache.addAll(
                        FICHIERS
                    );

                }
            )

        );

        self.skipWaiting();

    }
);


// ==========================================
// ACTIVATION
// ==========================================

self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(

            caches.keys()
                .then(
                    function(nomsCaches) {

                        return Promise.all(

                            nomsCaches.map(
                                function(nomCache) {

                                    if (
                                        nomCache !==
                                        CACHE_NAME
                                    ) {

                                        return caches.delete(
                                            nomCache
                                        );

                                    }

                                }
                            )

                        );

                    }
                )

        );

        self.clients.claim();

    }
);


// ==========================================
// REQUÊTES
// ==========================================

self.addEventListener(
    "fetch",
    function(event) {

        const request =
            event.request;


        // ==========================================
        // NE PAS METTRE EN CACHE LES REQUÊTES API
        // ==========================================

        if (
            request.url.includes(
                "calculateur-expedition-api"
            )
        ) {

            event.respondWith(

                fetch(request)
                    .catch(
                        function() {

                            return new Response(
                                JSON.stringify({

                                    succes:
                                        false,

                                    message:
                                        "Connexion au serveur impossible."

                                }),
                                {
                                    status: 503,

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    }
                                }
                            );

                        }
                    )

            );

            return;

        }


        // ==========================================
        // FICHIERS DE L'APPLICATION
        // ==========================================

        event.respondWith(

            caches.match(request)
                .then(
                    function(reponseCache) {

                        if (
                            reponseCache
                        ) {

                            return reponseCache;

                        }


                        return fetch(request)
                            .then(
                                function(reponseReseau) {

                                    if (
                                        !reponseReseau ||
                                        reponseReseau.status !== 200 ||
                                        reponseReseau.type === "opaque"
                                    ) {

                                        return reponseReseau;

                                    }


                                    const copie =
                                        reponseReseau.clone();


                                    caches.open(
                                        CACHE_NAME
                                    )
                                    .then(
                                        function(cache) {

                                            cache.put(
                                                request,
                                                copie
                                            );

                                        }
                                    );


                                    return reponseReseau;

                                }
                            );

                    }
                )

        );

    }
);
