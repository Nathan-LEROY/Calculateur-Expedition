```javascript
// ==========================================
// CALCULATEUR D'EXPÉDITION
// SCRIPT.JS
// ==========================================


const TAUX_YUAN_AR_DEFAUT = 670;


const URL_WORKER =
    "https://calculateur-expedition-api.jjandrianarivony.workers.dev/";


// ==========================================
// TARIFS
// ==========================================

const TARIFS_AVION = {

    general_express: 78800,

    general_normal: 65800,

    batterie: 128000,

    poudre: 88000

};


const TARIFS_MARITIME = {

    general: 360,

    batterie: 425

};


// ==========================================
// ELEMENTS HTML
// ==========================================

const transport =
    document.getElementById("transport");

const marchandise =
    document.getElementById("marchandise");

const service =
    document.getElementById("service");

const blocService =
    document.getElementById("bloc-service");

const blocPoids =
    document.getElementById("bloc-poids");

const hauteur =
    document.getElementById("hauteur");

const longueur =
    document.getElementById("longueur");

const largeur =
    document.getElementById("largeur");

const poids =
    document.getElementById("poids");

const prixYuan =
    document.getElementById("prix-yuan");

const tauxYuan =
    document.getElementById("taux-yuan");

const tauxDollar =
    document.getElementById("taux-dollar");

const zoneTauxDollar =
    document.getElementById("zone-taux-dollar");

const boutonCalculer =
    document.getElementById("calculer");

const resultats =
    document.getElementById("resultats");

const choixEmballage =
    document.getElementById("choix-emballage");


// ==========================================
// EMBALLAGE
// ==========================================

const EMBALLAGES = {

    "petit-sachet": {
        nom: "Petit sachet",
        marge: 1,
        poids: 0.010
    },

    "sachet": {
        nom: "Sachet",
        marge: 1.5,
        poids: 0.020
    },

    "enveloppe": {
        nom: "Enveloppe",
        marge: 2,
        poids: 0.030
    },

    "petit-carton": {
        nom: "Petit carton",
        marge: 2,
        poids: 0.050
    },

    "carton": {
        nom: "Carton",
        marge: 3,
        poids: 0.150
    },

    "grand-carton": {
        nom: "Grand carton",
        marge: 5,
        poids: 0.300
    }

};


window.typeEmballageAuto = "carton";


// ==========================================
// TRANSPORT
// ==========================================

function mettreAJourTransport() {

    if (!transport) return;


    const avion =
        transport.value === "avion";


    if (blocService) {

        blocService.style.display =
            avion ? "block" : "none";

    }


    if (blocPoids) {

        blocPoids.style.display =
            avion ? "block" : "none";

    }


    if (zoneTauxDollar) {

        zoneTauxDollar.style.display =
            avion ? "none" : "block";

    }


    if (tauxDollar && avion) {

        tauxDollar.value = "";

    }

}


// ==========================================
// POIDS VOLUMETRIQUE
// ==========================================

function calculerPoidsVolumetrique(
    typeEmballage = "carton"
) {

    const H =
        parseFloat(hauteur?.value) || 0;

    const L =
        parseFloat(longueur?.value) || 0;

    const l =
        parseFloat(largeur?.value) || 0;


    const emballage =
        EMBALLAGES[typeEmballage] ||
        EMBALLAGES.carton;


    const marge =
        emballage.marge;


    const Hcolis =
        H + marge * 2;

    const Lcolis =
        L + marge * 2;

    const lcolis =
        l + marge * 2;


    return (
        Hcolis *
        Lcolis *
        lcolis
    ) / 6000;

}


// ==========================================
// POIDS EMBALLAGE
// ==========================================

function obtenirPoidsEmballage(
    typeEmballage = "carton"
) {

    const emballage =
        EMBALLAGES[typeEmballage] ||
        EMBALLAGES.carton;


    return emballage.poids;

}


// ==========================================
// MARGE
// ==========================================

function obtenirMargeEmballage(
    typeEmballage = "carton"
) {

    const emballage =
        EMBALLAGES[typeEmballage] ||
        EMBALLAGES.carton;


    return emballage.marge;

}


// ==========================================
// POIDS FACTURABLE
// ==========================================

function calculerPoidsFacturable(
    typeEmballage = "carton"
) {

    const poidsProduit =
        parseFloat(poids?.value) || 0;


    const poidsEmballage =
        obtenirPoidsEmballage(
            typeEmballage
        );


    const poidsReel =
        poidsProduit +
        poidsEmballage;


    const poidsVolumetrique =
        calculerPoidsVolumetrique(
            typeEmballage
        );


    return Math.max(
        poidsReel,
        poidsVolumetrique
    );

}


// ==========================================
// INFORMATIONS EMBALLAGE
// ==========================================

function calculerInformationsEmballage(
    type
) {

    const emballage =
        EMBALLAGES[type];


    const emballageInfo =
        document.getElementById(
            "emballage-recherche"
        );

    const typeInfo =
        document.getElementById(
            "type-emballage-info"
        );

    const poidsInfo =
        document.getElementById(
            "poids-emballage-info"
        );

    const dimensionsInfo =
        document.getElementById(
            "dimensions-emballage-info"
        );


    if (!emballage) return;


    const H =
        parseFloat(hauteur?.value) || 0;

    const L =
        parseFloat(longueur?.value) || 0;

    const l =
        parseFloat(largeur?.value) || 0;


    if (
        H <= 0 ||
        L <= 0 ||
        l <= 0
    ) {

        if (emballageInfo)
            emballageInfo.textContent =
                "📦 EMBALLAGE : " +
                emballage.nom;

        if (typeInfo)
            typeInfo.textContent =
                "🏷️ Type : Dimensions nécessaires";

        if (poidsInfo)
            poidsInfo.textContent =
                "⚖️ Poids emballage : " +
                emballage.poids.toFixed(3) +
                " kg";

        if (dimensionsInfo)
            dimensionsInfo.textContent =
                "📏 Dimensions emballage : —";

        return;

    }


    const marge =
        emballage.marge;


    const Hcolis =
        H + marge * 2;

    const Lcolis =
        L + marge * 2;

    const lcolis =
        l + marge * 2;


    if (emballageInfo)
        emballageInfo.textContent =
            "📦 EMBALLAGE : " +
            emballage.nom;


    if (typeInfo)
        typeInfo.textContent =
            "🏷️ Type : " +
            emballage.nom;


    if (poidsInfo)
        poidsInfo.textContent =
            "⚖️ Poids emballage : " +
            emballage.poids.toFixed(3) +
            " kg";


    if (dimensionsInfo)
        dimensionsInfo.textContent =
            "📏 Dimensions emballage : " +
            Hcolis.toFixed(2) +
            " × " +
            Lcolis.toFixed(2) +
            " × " +
            lcolis.toFixed(2) +
            " cm";

}


// ==========================================
// DETECTION EMBALLAGE
// ==========================================

function detecterEmballageAutomatique(
    produit
) {

    const texte =
        (produit || "").toLowerCase();


    if (
        texte.includes("câble") ||
        texte.includes("cable") ||
        texte.includes("chargeur") ||
        texte.includes("airpods") ||
        texte.includes("écouteur") ||
        texte.includes("ecouteur") ||
        texte.includes("coque") ||
        texte.includes("étui") ||
        texte.includes("etui") ||
        texte.includes("adaptateur") ||
        texte.includes("montre") ||
        texte.includes("watch")
    ) {

        return "petit-sachet";

    }


    if (
        texte.includes("document") ||
        texte.includes("livre") ||
        texte.includes("enveloppe") ||
        texte.includes("photo") ||
        texte.includes("papier") ||
        texte.includes("poster")
    ) {

        return "enveloppe";

    }


    if (
        texte.includes("ordinateur") ||
        texte.includes("pc portable") ||
        texte.includes("laptop") ||
        texte.includes("écran") ||
        texte.includes("ecran") ||
        texte.includes("moniteur") ||
        texte.includes("télévision") ||
        texte.includes("television") ||
        texte.includes("imprimante") ||
        texte.includes("réfrigérateur") ||
        texte.includes("refrigerateur") ||
        texte.includes("micro-onde") ||
        texte.includes("micro onde")
    ) {

        return "grand-carton";

    }


    if (
        texte.includes("iphone") ||
        texte.includes("ipad") ||
        texte.includes("smartphone") ||
        texte.includes("téléphone") ||
        texte.includes("telephone") ||
        texte.includes("samsung") ||
        texte.includes("galaxy") ||
        texte.includes("xiaomi") ||
        texte.includes("redmi") ||
        texte.includes("pixel") ||
        texte.includes("huawei") ||
        texte.includes("oppo") ||
        texte.includes("oneplus") ||
        texte.includes("realme") ||
        texte.includes("vivo") ||
        texte.includes("tablette")
    ) {

        return "carton";

    }


    if (
        texte.includes("chaussure") ||
        texte.includes("chaussures") ||
        texte.includes("sneaker") ||
        texte.includes("sneakers") ||
        texte.includes("basket") ||
        texte.includes("baskets") ||
        texte.includes("nike") ||
        texte.includes("adidas") ||
        texte.includes("puma") ||
        texte.includes("reebok") ||
        texte.includes("new balance") ||
        texte.includes("converse") ||
        texte.includes("asics") ||
        texte.includes("vans") ||
        texte.includes("jordan")
    ) {

        return "carton";

    }


    if (
        texte.includes("vêtement") ||
        texte.includes("vetement") ||
        texte.includes("chemise") ||
        texte.includes("pantalon") ||
        texte.includes("jean") ||
        texte.includes("robe") ||
        texte.includes("manteau") ||
        texte.includes("veste") ||
        texte.includes("pull") ||
        texte.includes("t-shirt") ||
        texte.includes("tee shirt")
    ) {

        return "sachet";

    }


    return "carton";

}


// ==========================================
// POIDS DIAGNOSTIC
//
// IMPORTANT : on refuse les faux poids comme
// "36 g" pour une recherche "Adidas Super Star 36 FR"
// ==========================================

function extrairePoidsDiagnostic(
    diagnostic,
    recherche = ""
) {

    if (!Array.isArray(diagnostic)) {
        return null;
    }


    const texteRecherche =
        String(recherche)
            .toLowerCase()
            .trim();


    const candidats = [];


    diagnostic.forEach(function(item) {

        if (!item) return;


        const poids =
            parseFloat(
                item.poids_trouve
            );


        if (
            !Number.isFinite(poids) ||
            poids <= 0
        ) {
            return;
        }


        const texte =
            (
                String(item.produit_trouve || "") +
                " " +
                String(item.titre || "") +
                " " +
                String(item.nom || "") +
                " " +
                String(item.description || "") +
                " " +
                String(item.extrait || "")
            ).toLowerCase();


        /*
         * Si le résultat contient une unité de conversion
         * ou ressemble à une page de conversion,
         * on refuse le poids.
         */

        if (
            texte.includes("grams to kg") ||
            texte.includes("gram to kg") ||
            texte.includes("grams-to-kg") ||
            texte.includes("convert grams") ||
            texte.includes("convertir grammes") ||
            texte.includes("conversion") ||
            texte.includes("convertisseur")
        ) {

            return;

        }


        /*
         * Si la recherche contient une pointure,
         * un nombre identique ne doit PAS être considéré
         * automatiquement comme un poids.
         */

        const pointure =
            texteRecherche.match(
                /\b(?:pointure|size|taille)?\s*(\d{2}(?:[.,]\d+)?)\s*(?:fr|eu|eur|europe|us|uk)?\b/i
            );


        if (
            pointure &&
            Math.abs(
                poids * 1000 -
                parseFloat(
                    pointure[1]
                )
            ) < 0.001
        ) {

            return;

        }


        /*
         * Les chaussures ne peuvent normalement pas
         * peser quelques dizaines de grammes.
         */

        const rechercheChaussure =
            /chaussure|sneaker|basket|adidas|nike|puma|reebok|converse|asics|vans|jordan/i
                .test(texteRecherche);


        if (
            rechercheChaussure &&
            poids < 0.20
        ) {

            return;

        }


        candidats.push({

            poids: poids,

            produitTrouve:
                item.produit_trouve === true,

            numero:
                Number(item.numero) || 999,

            url:
                item.url || null

        });

    });


    if (!candidats.length) {
        return null;
    }


    candidats.sort(function(a, b) {

        if (
            a.produitTrouve !==
            b.produitTrouve
        ) {

            return b.produitTrouve -
                a.produitTrouve;

        }


        return a.numero -
            b.numero;

    });


    return candidats[0].poids;

}


// ==========================================
// SOURCE
// ==========================================

function extraireSourceDiagnostic(
    diagnostic
) {

    if (!Array.isArray(diagnostic)) {
        return null;
    }


    for (
        const item of diagnostic
    ) {

        if (
            item &&
            item.url &&
            item.poids_trouve !== null &&
            item.poids_trouve !== undefined
        ) {

            return item.url;

        }

    }


    return null;

}


// ==========================================
// CALCUL
// ==========================================

if (boutonCalculer) {

    boutonCalculer.addEventListener(
        "click",
        function() {


            const H =
                parseFloat(hauteur?.value);

            const L =
                parseFloat(longueur?.value);

            const l =
                parseFloat(largeur?.value);

            const P =
                parseFloat(poids?.value);

            const prix =
                parseFloat(prixYuan?.value);


            if (
                !H ||
                H <= 0 ||
                !L ||
                L <= 0 ||
                !l ||
                l <= 0
            ) {

                resultats.innerHTML =
                    "<p>⚠️ Veuillez renseigner correctement les dimensions.</p>";

                return;

            }


            if (
                transport.value === "avion" &&
                (!P || P <= 0)
            ) {

                resultats.innerHTML =
                    "<p>⚠️ Veuillez renseigner le poids réel.</p>";

                return;

            }


            if (
                !Number.isFinite(prix) ||
                prix < 0
            ) {

                resultats.innerHTML =
                    "<p>⚠️ Veuillez renseigner le prix en Yuan.</p>";

                return;

            }


            const tauxYuanUtilise =
                parseFloat(
                    tauxYuan?.value
                ) ||
                TAUX_YUAN_AR_DEFAUT;


            const montantMarchandiseAR =
                prix *
                tauxYuanUtilise;


            if (
                transport.value === "avion"
            ) {

                calculerAvion(
                    prix,
                    montantMarchandiseAR
                );

            }

            else {

                calculerMaritime(
                    prix,
                    montantMarchandiseAR
                );

            }

        }
    );

}


// ==========================================
// AVION
// ==========================================

function calculerAvion(
    montantYuan,
    montantMarchandiseAR
) {

    const poidsProduit =
        parseFloat(
            poids?.value
        ) || 0;


    const typeEmballage =
        window.typeEmballageAuto ||
        "carton";


    const poidsEmballage =
        obtenirPoidsEmballage(
            typeEmballage
        );


    const poidsReel =
        poidsProduit +
        poidsEmballage;


    const poidsVolumetrique =
        calculerPoidsVolumetrique(
            typeEmballage
        );


    const poidsFacturable =
        Math.max(
            poidsReel,
            poidsVolumetrique
        );


    let tarif;

    let nomTarif;

    let jourDepart;

    let delai;


    if (
        marchandise.value === "general"
    ) {

        if (
            service.value === "express"
        ) {

            tarif =
                TARIFS_AVION.general_express;

            nomTarif =
                "Marchandise générale - EXPRESS";

            jourDepart =
                "Tous les lundis et jeudis";

            delai =
                "3 à 5 jours";

        }

        else {

            tarif =
                TARIFS_AVION.general_normal;

            nomTarif =
                "Marchandise générale - NORMAL";

            jourDepart =
                "Tous les lundis";

            delai =
                "7 à 10 jours";

        }

    }

    else if (
        marchandise.value === "batterie"
    ) {

        tarif =
            TARIFS_AVION.batterie;

        nomTarif =
            "Marchandise avec batterie";

        jourDepart =
            "Tous les jeudis";

        delai =
            "15 jours";

    }

    else {

        tarif =
            TARIFS_AVION.poudre;

        nomTarif =
            "Poudre / Liquide / Aimant";

        jourDepart =
            "Tous les jeudis";

        delai =
            "10 à 15 jours";

    }


    const fraisTransport =
        poidsFacturable *
        tarif;


    const total =
        fraisTransport +
        montantMarchandiseAR;


    resultats.innerHTML = `

<h3>✈️ TRANSPORT : AVION</h3>

<p>
📦 Type :
<strong>${nomTarif}</strong>
</p>

<p>
⚖️ Poids réel avec emballage :
<strong>${poidsReel.toFixed(3)} kg</strong>
</p>

<p>
📐 Poids volumétrique :
<strong>${poidsVolumetrique.toFixed(3)} kg</strong>
</p>

<p>
💰 Poids facturable :
<strong>${poidsFacturable.toFixed(3)} kg</strong>
</p>

<p>
💵 Tarif :
<strong>${tarif.toLocaleString("fr-FR")} AR/kg</strong>
</p>

<p>
🚚 Frais de transport :
<strong>${fraisTransport.toLocaleString("fr-FR")} AR</strong>
</p>

<hr>

<p>
💴 Prix marchandise :
<strong>${montantYuan.toLocaleString("fr-FR")} Yuan</strong>
</p>

<p>
💰 Valeur marchandise :
<strong>${montantMarchandiseAR.toLocaleString("fr-FR")} AR</strong>
</p>

<hr>

<p>
🧾 TOTAL :
<strong>${total.toLocaleString("fr-FR")} AR</strong>
</p>

<p>
📅 Départ :
<strong>${jourDepart}</strong>
</p>

<p>
⏱️ Délai :
<strong>${delai}</strong>
</p>

`;

}


// ==========================================
// MARITIME
// ==========================================

function calculerVolumeMaritime() {

    const H =
        parseFloat(hauteur?.value) || 0;

    const L =
        parseFloat(longueur?.value) || 0;

    const l =
        parseFloat(largeur?.value) || 0;


    return (
        H *
        L *
        l
    ) / 1000000;

}


function calculerMaritime(
    montantYuan,
    montantMarchandiseAR
) {

    const volume =
        calculerVolumeMaritime();


    let tarif;


    let nomTarif;


    if (
        marchandise.value === "general"
    ) {

        tarif =
            TARIFS_MARITIME.general;

        nomTarif =
            "Marchandise générale";

    }

    else if (
        marchandise.value === "batterie"
    ) {

        tarif =
            TARIFS_MARITIME.batterie;

        nomTarif =
            "Marchandise avec batterie";

    }

    else {

        resultats.innerHTML =
            "<p>⚠️ Cette marchandise n'est pas disponible en maritime.</p>";

        return;

    }


    const tauxDollarUtilise =
        parseFloat(
            tauxDollar?.value
        ) || 0;


    if (
        tauxDollarUtilise <= 0
    ) {

        resultats.innerHTML =
            "<p>⚠️ Veuillez saisir le taux Dollar → AR.</p>";

        return;

    }


    const fraisDollar =
        volume *
        tarif;


    const fraisTransportAR =
        fraisDollar *
        tauxDollarUtilise;


    const total =
        fraisTransportAR +
        montantMarchandiseAR;


    resultats.innerHTML = `

<h3>🚢 TRANSPORT : MARITIME</h3>

<p>
📦 Type :
<strong>${nomTarif}</strong>
</p>

<p>
📐 Volume :
<strong>${volume.toFixed(3)} m³</strong>
</p>

<p>
💵 Tarif :
<strong>${tarif.toLocaleString("fr-FR")} $/m³</strong>
</p>

<p>
🚢 Transport :
<strong>${fraisDollar.toLocaleString("fr-FR")} $</strong>
</p>

<p>
💱 Taux Dollar :
<strong>${tauxDollarUtilise.toLocaleString("fr-FR")} AR/$</strong>
</p>

<p>
🚢 Transport en AR :
<strong>${fraisTransportAR.toLocaleString("fr-FR")} AR</strong>
</p>

<hr>

<p>
💴 Prix marchandise :
<strong>${montantYuan.toLocaleString("fr-FR")} Yuan</strong>
</p>

<p>
💰 Valeur marchandise :
<strong>${montantMarchandiseAR.toLocaleString("fr-FR")} AR</strong>
</p>

<hr>

<p>
🧾 TOTAL :
<strong>${total.toLocaleString("fr-FR")} AR</strong>
</p>

<p>
📅 Départ :
<strong>Tous les vendredis</strong>
</p>

<p>
⏱️ Délai :
<strong>45 à 60 jours</strong>
</p>

`;

}


// ==========================================
// RECHERCHE PRODUIT
// ==========================================

const btnRechercheProduit =
    document.getElementById(
        "btnRechercheProduit"
    );


if (btnRechercheProduit) {

    btnRechercheProduit.addEventListener(
        "click",
        async function() {


            const rechercheProduit =
                document.getElementById(
                    "recherche-produit"
                );


            const texteRecherche =
                rechercheProduit
                    ? rechercheProduit.value.trim()
                    : "";


            const sourceProduit =
                document.getElementById(
                    "source-produit"
                );

            const poidsRecherche =
                document.getElementById(
                    "poids-recherche"
                );

            const dimensionsRecherche =
                document.getElementById(
                    "dimensions-recherche"
                );

            const poidsFacturableRecherche =
                document.getElementById(
                    "poids-facturable-recherche"
                );

            const etatRechercheProduit =
                document.getElementById(
                    "etat-recherche-produit"
                );

            const produitAffiche =
                document.getElementById(
                    "produit-recherche-info"
                );

            const modeleAffiche =
                document.getElementById(
                    "modele-recherche-info"
                );

            const statutAffiche =
                document.getElementById(
                    "statut-recherche-info"
                );


            if (!texteRecherche) {

                if (etatRechercheProduit)
                    etatRechercheProduit.textContent =
                        "⚠️ Veuillez indiquer un produit.";

                return;

            }


            if (etatRechercheProduit)
                etatRechercheProduit.textContent =
                    "🔎 Recherche en cours...";


            if (produitAffiche)
                produitAffiche.textContent =
                    "📦 Produit recherché : " +
                    texteRecherche;


            if (poidsRecherche)
                poidsRecherche.textContent =
                    "⚖️ Poids réel trouvé : Recherche...";


            if (dimensionsRecherche)
                dimensionsRecherche.textContent =
                    "📏 Dimensions trouvées : Recherche...";


            try {

                const urlAPI =
                    URL_WORKER +
                    "?produit=" +
                    encodeURIComponent(
                        texteRecherche
                    );


                const response =
                    await fetch(
                        urlAPI,
                        {
                            method: "GET",
                            cache: "no-store"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Erreur HTTP " +
                        response.status
                    );

                }


                const donnees =
                    await response.json();


                console.log(
                    "REPONSE WORKER :",
                    donnees
                );


                if (
                    donnees.succes === false
                ) {

                    throw new Error(
                        donnees.message ||
                        "Recherche impossible"
                    );

                }


                /*
                 * ======================================
                 * PRODUIT / MODELE
                 * ======================================
                 */

                if (produitAffiche) {

                    produitAffiche.textContent =
                        "📦 Produit recherché : " +
                        (
                            donnees.produit ||
                            texteRecherche
                        );

                }


                if (modeleAffiche) {

                    modeleAffiche.textContent =
                        "🏷️ Modèle : " +
                        (
                            donnees.modele ||
                            "—"
                        );

                }


                /*
                 * ======================================
                 * POIDS
                 * ======================================
                 */

                let poidsTrouve = null;


                if (
                    donnees.poids_reel !== null &&
                    donnees.poids_reel !== undefined
                ) {

                    const valeur =
                        parseFloat(
                            donnees.poids_reel
                        );


                    if (
                        Number.isFinite(valeur) &&
                        valeur > 0
                    ) {

                        /*
                         * Protection supplémentaire :
                         * une chaussure ne peut pas avoir
                         * un poids de quelques grammes.
                         */

                        const rechercheChaussure =
                            /chaussure|sneaker|basket|adidas|nike|puma|reebok|converse|asics|vans|jordan/i
                                .test(
                                    texteRecherche
                                );


                        if (
                            !(
                                rechercheChaussure &&
                                valeur < 0.20
                            )
                        ) {

                            poidsTrouve =
                                valeur;

                        }

                    }

                }


                /*
                 * Si le Worker n'a pas fourni de poids
                 * fiable, on regarde le diagnostic.
                 */

                if (
                    poidsTrouve === null
                ) {

                    poidsTrouve =
                        extrairePoidsDiagnostic(
                            donnees.diagnostic,
                            texteRecherche
                        );

                }


                if (
                    poidsTrouve !== null
                ) {

                    if (poidsRecherche)
                        poidsRecherche.textContent =
                            "⚖️ Poids réel trouvé : " +
                            poidsTrouve.toFixed(3) +
                            " kg";


                    if (poids)
                        poids.value =
                            poidsTrouve;

                }

                else {

                    if (poidsRecherche)
                        poidsRecherche.textContent =
                            "⚖️ Poids réel trouvé : Non disponible";


                    /*
                     * IMPORTANT :
                     * on efface un ancien poids pour éviter
                     * qu'un ancien produit soit réutilisé.
                     */

                    if (poids)
                        poids.value = "";

                }


                /*
                 * ======================================
                 * DIMENSIONS
                 * ======================================
                 */

                let dimensionsTrouvees = false;


                if (
                    donnees.dimensions
                ) {

                    const h =
                        parseFloat(
                            donnees.dimensions.hauteur_cm
                        );

                    const lo =
                        parseFloat(
                            donnees.dimensions.longueur_cm
                        );

                    const la =
                        parseFloat(
                            donnees.dimensions.largeur_cm
                        );


                    if (
                        h > 0 &&
                        lo > 0 &&
                        la > 0
                    ) {

                        dimensionsTrouvees =
                            true;


                        hauteur.value =
                            h;

                        longueur.value =
                            lo;

                        largeur.value =
                            la;


                        if (dimensionsRecherche)
                            dimensionsRecherche.textContent =
                                "📏 Dimensions trouvées : " +
                                h.toFixed(2) +
                                " × " +
                                lo.toFixed(2) +
                                " × " +
                                la.toFixed(2) +
                                " cm";

                    }

                }


                if (
                    !dimensionsTrouvees
                ) {

                    if (dimensionsRecherche)
                        dimensionsRecherche.textContent =
                            "📏 Dimensions trouvées : Non disponibles";

                }


                /*
                 * ======================================
                 * EMBALLAGE
                 * ======================================
                 */

                let emballage =
                    detecterEmballageAutomatique(
                        texteRecherche
                    );


                if (
                    choixEmballage &&
                    choixEmballage.value !== "auto"
                ) {

                    emballage =
                        choixEmballage.value;

                }


                window.typeEmballageAuto =
                    emballage;


                if (choixEmballage)
                    choixEmballage.value =
                        "auto";


                calculerInformationsEmballage(
                    emballage
                );


                /*
                 * ======================================
                 * POIDS FACTURABLE
                 * ======================================
                 */

                if (
                    poidsTrouve !== null &&
                    parseFloat(hauteur.value) > 0 &&
                    parseFloat(longueur.value) > 0 &&
                    parseFloat(largeur.value) > 0
                ) {

                    const poidsFacturable =
                        calculerPoidsFacturable(
                            emballage
                        );


                    if (poidsFacturableRecherche)
                        poidsFacturableRecherche.textContent =
                            "💰 Poids facturable : " +
                            poidsFacturable.toFixed(3) +
                            " kg";

                }

                else {

                    if (poidsFacturableRecherche)
                        poidsFacturableRecherche.textContent =
                            "💰 Poids facturable : Non calculable";

                }


                /*
                 * ======================================
                 * SOURCE
                 * ======================================
                 */

                const source =
                    donnees.source ||
                    extraireSourceDiagnostic(
                        donnees.diagnostic
                    );


                if (sourceProduit)
                    sourceProduit.textContent =
                        "🌐 Source : " +
                        (
                            source ||
                            "Non disponible"
                        );


                /*
                 * ======================================
                 * STATUT
                 * ======================================
                 */

                if (statutAffiche)
                    statutAffiche.textContent =
                        "ℹ️ Statut : " +
                        (
                            donnees.statut ||
                            (
                                poidsTrouve !== null
                                    ? "Informations trouvées"
                                    : "Produit trouvé, mais poids non disponible"
                            )
                        );


                if (etatRechercheProduit) {

                    if (
                        poidsTrouve !== null
                    ) {

                        etatRechercheProduit.textContent =
                            "✅ Recherche effectuée pour : " +
                            texteRecherche;

                    }

                    else {

                        etatRechercheProduit.textContent =
                            "⚠️ Produit trouvé, mais poids non disponible.";

                    }

                }


            }

            catch (erreur) {

                console.error(
                    "ERREUR RECHERCHE :",
                    erreur
                );


                if (sourceProduit)
                    sourceProduit.textContent =
                        "🌐 Source : Erreur";


                if (poidsRecherche)
                    poidsRecherche.textContent =
                        "⚖️ Poids réel trouvé : Non disponible";


                if (dimensionsRecherche)
                    dimensionsRecherche.textContent =
                        "📏 Dimensions trouvées : Non disponibles";


                if (poidsFacturableRecherche)
                    poidsFacturableRecherche.textContent =
                        "💰 Poids facturable : Non calculable";


                if (statutAffiche)
                    statutAffiche.textContent =
                        "ℹ️ Statut : Recherche impossible";


                if (etatRechercheProduit)
                    etatRechercheProduit.textContent =
                        "❌ Impossible d'effectuer la recherche.";


                if (poids)
                    poids.value = "";

            }

        }
    );

}


// ==========================================
// CHANGEMENT EMBALLAGE
// ==========================================

if (choixEmballage) {

    choixEmballage.addEventListener(
        "change",
        function() {


            let type =
                choixEmballage.value;


            if (
                type === "auto"
            ) {

                type =
                    window.typeEmballageAuto ||
                    "carton";

            }


            window.typeEmballageAuto =
                type;


            calculerInformationsEmballage(
                type
            );


            const poidsFacturable =
                calculerPoidsFacturable(
                    type
                );


            const affichage =
                document.getElementById(
                    "poids-facturable-recherche"
                );


            if (affichage) {

                affichage.textContent =
                    "💰 Poids facturable : " +
                    pesoSafe(
                        poidsFacturable
                    ) +
                    " kg";

            }

        }
    );

}


function pesoSafe(valeur) {

    if (
        !Number.isFinite(valeur)
    ) {

        return "0.000";

    }


    return valorRound(
        valeur
    ).toFixed(3);

}


function valorRound(valeur) {

    return Math.round(
        valeur * 1000
    ) / 1000;

}


// ==========================================
// REINITIALISER
// ==========================================

function reinitialiser() {

    if (hauteur) hauteur.value = "";

    if (longueur) longueur.value = "";

    if (largeur) largeur.value = "";

    if (poids) poids.value = "";

    if (prixYuan) prixYuan.value = "";

    if (tauxYuan)
        tauxYuan.value =
            TAUX_YUAN_AR_DEFAUT;

    if (tauxDollar)
        tauxDollar.value = "";

    if (resultats)
        resultats.innerHTML = "";


    window.typeEmballageAuto =
        "carton";


    if (choixEmballage)
        choixEmballage.value =
            "auto";


    [
        "source-produit",
        "produit-recherche-info",
        "modele-recherche-info",
        "statut-recherche-info",
        "poids-recherche",
        "dimensions-recherche",
        "poids-facturable-recherche",
        "emballage-recherche",
        "type-emballage-info",
        "poids-emballage-info",
        "dimensions-emballage-info"
    ].forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element)
            element.textContent = "—";

    });


    const etat =
        document.getElementById(
            "etat-recherche-produit"
        );

    if (etat)
        etat.textContent = "";


    const recherche =
        document.getElementById(
            "recherche-produit"
        );

    if (recherche)
        recherche.value = "";


    const capture =
        document.getElementById(
            "capture-produit"
        );

    if (capture)
        capture.value = "";


    const apercu =
        document.getElementById(
            "apercu-capture"
        );

    if (apercu)
        apercu.innerHTML = "";

}


// ==========================================
// CAPTURE
// ==========================================

const captureProduit =
    document.getElementById(
        "capture-produit"
    );

const apercuCapture =
    document.getElementById(
        "apercu-capture"
    );


if (
    captureProduit &&
    apercuCapture
) {

    captureProduit.addEventListener(
        "change",
        function() {


            const fichier =
                this.files?.[0];


            if (!fichier)
                return;


            if (
                !fichier.type.startsWith(
                    "image/"
                )
            ) {

                apercuCapture.innerHTML =
                    "<p>❌ Veuillez sélectionner une image.</p>";

                return;

            }


            const lecteur =
                new FileReader();


            lecteur.onload =
                function(e) {

                    apercuCapture.innerHTML = `

<div class="cadre-apercu-capture">

<p>📸 Capture sélectionnée :</p>

<img
    src="${e.target.result}"
    alt="Capture produit"
>

<button
    type="button"
    id="supprimer-capture">

🗑️ SUPPRIMER LA CAPTURE

</button>

</div>

`;


                    const bouton =
                        document.getElementById(
                            "supprimer-capture"
                        );


                    if (bouton) {

                        bouton.addEventListener(
                            "click",
                            function() {

                                captureProduit.value =
                                    "";

                                apercuCapture.innerHTML =
                                    "";

                            }
                        );

                    }

                };


            lecteur.readAsDataURL(
                fichier
            );

        }
    );

}


// ==========================================
// DEVIS
// ==========================================

let numeroDevis = 0;


function ajouterDevis() {

    const nomProduit =
        document.getElementById(
            "recherche-produit"
        );


    const resultat =
        document.getElementById(
            "resultats"
        );


    const liste =
        document.getElementById(
            "liste-devis"
        );


    if (
        !nomProduit ||
        !nomProduit.value.trim()
    ) {

        alert(
            "⚠️ Veuillez renseigner le nom du produit."
        );

        return;

    }


    if (
        !resultat ||
        !resultat.innerText.trim()
    ) {

        alert(
            "⚠️ Veuillez d'abord effectuer un calcul."
        );

        return;

    }


    if (!liste) return;


    numeroDevis++;


    const date =
        new Date()
            .toLocaleDateString(
                "fr-FR"
            );


    const texte =
        resultat.innerText
            .replace(
                /📅 Départ :[^\n]*/g,
                ""
            )
            .replace(
                /⏱️ Délai :[^\n]*/g,
                ""
            )
            .trim();


    if (numeroDevis === 1) {

        liste.innerText =
`════════════════════════════════
         DEVIS EXPÉDITION
════════════════════════════════

Date : ${date}

1) 📦 Nom du produit : ${nomProduit.value.trim()}
${texte}

`;

    }

    else {

        liste.innerText +=
`
────────────────────────────────
${numeroDevis}) 📦 Nom du produit : ${nomProduit.value.trim()}
${texte}

`;

    }


    localStorage.setItem(
        "devisExpedition",
        liste.innerText
    );

}


// ==========================================
// EFFACER
// ==========================================

function effacerDevis() {

    const liste =
        document.getElementById(
            "liste-devis"
        );


    if (
        !liste ||
        !liste.innerText.trim()
    ) {

        alert(
            "ℹ️ Aucun devis à effacer."
        );

        return;

    }


    if (
        !confirm(
            "⚠️ Voulez-vous vraiment effacer tous les devis ?"
        )
    ) {

        return;

    }


    liste.innerText = "";

    numeroDevis = 0;


    localStorage.removeItem(
        "devisExpedition"
    );

}


// ==========================================
// COPIER
// ==========================================

async function copierDevis() {

    const liste =
        document.getElementById(
            "liste-devis"
        );


    if (
        !liste ||
        !liste.innerText.trim()
    ) {

        alert(
            "ℹ️ Aucun devis à copier."
        );

        return;

    }


    try {

        await navigator.clipboard.writeText(
            liste.innerText
        );


        alert(
            "✅ Tous les devis ont été copiés."
        );

    }

    catch (e) {

        alert(
            "⚠️ Impossible de copier les devis."
        );

    }

}


// ==========================================
// IMPRIMER
// ==========================================

function imprimerDevis() {

    const liste =
        document.getElementById(
            "liste-devis"
        );


    if (
        !liste ||
        !liste.innerText.trim()
    ) {

        alert(
            "ℹ️ Aucun devis à imprimer."
        );

        return;

    }


    const fenetre =
        window.open(
            "",
            "_blank",
            "width=800,height=600"
        );


    if (!fenetre) {

        alert(
            "⚠️ Fenêtre bloquée."
        );

        return;

    }


    fenetre.document.write(`

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>Devis</title>

<style>

body {

font-family:
"Courier New",
monospace;

font-size:14px;

white-space:pre-wrap;

padding:30px;

}

</style>

</head>

<body>

${liste.innerText}

</body>

</html>

`);


    fenetre.document.close();


    fenetre.focus();


    setTimeout(
        function() {

            fenetre.print();

        },
        300
    );

}


// ==========================================
// AFFICHER DEVIS
// ==========================================

function afficherMasquerDevis() {

    const bloc =
        document.getElementById(
            "bloc-devis"
        );


    const bouton =
        document.getElementById(
            "btnAfficherDevis"
        );


    if (!bloc) return;


    const cache =
        bloc.style.display === "none";


    bloc.style.display =
        cache ? "block" : "none";


    if (bouton) {

        bouton.textContent =
            cache
                ? "📄 MASQUER LES DEVIS"
                : "📄 DEVIS";

    }

}


// ==========================================
// CHARGER DEVIS
// ==========================================

window.addEventListener(
    "DOMContentLoaded",
    function() {

        mettreAJourTransport();


        const liste =
            document.getElementById(
                "liste-devis"
            );


        if (!liste) return;


        const sauvegarde =
            localStorage.getItem(
                "devisExpedition"
            );


        if (
            sauvegarde &&
            sauvegarde.trim()
        ) {

            liste.innerText =
                sauvegarde;


            const correspondances =
                sauvegarde.match(
                    /^\d+\) 📦 Nom du produit :/gm
                );


            if (correspondances) {

                numeroDevis =
                    correspondances.length;

            }

        }

    }
);
```
