// ==========================================
// CALCULATEUR D'EXPÉDITION
// ==========================================


// ==========================================
// PARAMÈTRES
// ==========================================

const TAUX_YUAN_AR_DEFAUT = 670;


// ==========================================
// URL WORKER CLOUDFLARE
// ==========================================

const URL_WORKER =
    "https://calculateur-expedition-api.jjandrianarivony.workers.dev/";


// ==========================================
// TARIFS AVION
// ==========================================

const TARIFS_AVION = {

    general_express: 78800,

    general_normal: 65800,

    batterie: 128000,

    poudre: 88000

};


// ==========================================
// TARIFS MARITIME
// ==========================================

const TARIFS_MARITIME = {

    general: 360,

    batterie: 425

};


// ==========================================
// ÉLÉMENTS HTML
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
// EMBALLAGE PAR DÉFAUT
// ==========================================

window.typeEmballageAuto =
    "carton";


// ==========================================
// AFFICHER / CACHER CHAMPS
// ==========================================

function mettreAJourTransport() {

    if (!transport) {
        return;
    }


    if (transport.value === "avion") {

        if (blocService) {
            blocService.style.display = "block";
        }

        if (blocPoids) {
            blocPoids.style.display = "block";
        }

        if (zoneTauxDollar) {
            zoneTauxDollar.style.display = "none";
        }

        if (tauxDollar) {
            tauxDollar.value = "";
        }

    }

    else {

        if (blocService) {
            blocService.style.display = "none";
        }

        if (blocPoids) {
            blocPoids.style.display = "none";
        }

        if (zoneTauxDollar) {
            zoneTauxDollar.style.display = "block";
        }

    }

}


// ==========================================
// POIDS VOLUMÉTRIQUE
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


    let marge = 3;


    switch (typeEmballage) {

        case "petit-sachet":
            marge = 1;
            break;

        case "sachet":
            marge = 1.5;
            break;

        case "enveloppe":
            marge = 2;
            break;

        case "petit-carton":
            marge = 2;
            break;

        case "carton":
            marge = 3;
            break;

        case "grand-carton":
            marge = 5;
            break;

    }


    const hauteurColis =
        H + marge * 2;

    const longueurColis =
        L + marge * 2;

    const largeurColis =
        l + marge * 2;


    return (
        hauteurColis *
        longueurColis *
        largeurColis
    ) / 6000;

}


// ==========================================
// POIDS EMBALLAGE
// ==========================================

function obtenirPoidsEmballage(
    typeEmballage = "carton"
) {

    switch (typeEmballage) {

        case "petit-sachet":
            return 0.010;

        case "sachet":
            return 0.020;

        case "enveloppe":
            return 0.030;

        case "petit-carton":
            return 0.050;

        case "carton":
            return 0.150;

        case "grand-carton":
            return 0.300;

        default:
            return 0.150;

    }

}


// ==========================================
// MARGE EMBALLAGE
// ==========================================

function obtenirMargeEmballage(
    typeEmballage = "carton"
) {

    switch (typeEmballage) {

        case "petit-sachet":
            return 1;

        case "sachet":
            return 1.5;

        case "enveloppe":
            return 2;

        case "petit-carton":
            return 2;

        case "carton":
            return 3;

        case "grand-carton":
            return 5;

        default:
            return 3;

    }

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


    const poidsReelColis =
        poidsProduit +
        poidsEmballage;


    const poidsVolumetrique =
        calculerPoidsVolumetrique(
            typeEmballage
        );


    return Math.max(
        poidsReelColis,
        poidsVolumetrique
    );

}


// ==========================================
// INFORMATIONS EMBALLAGE
// ==========================================

function calculerInformationsEmballage(
    type
) {

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

    const emballageInfo =
        document.getElementById(
            "emballage-recherche"
        );


    if (
        !type ||
        !typeInfo ||
        !poidsInfo ||
        !dimensionsInfo ||
        !emballageInfo
    ) {

        return;

    }


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

        emballageInfo.textContent =
            "📦 EMBALLAGE : —";

        typeInfo.textContent =
            "🏷️ Type : Dimensions nécessaires";

        poidsInfo.textContent =
            "⚖️ Poids emballage : —";

        dimensionsInfo.textContent =
            "📏 Dimensions emballage : —";

        return;

    }


    const marge =
        obtenirMargeEmballage(type);

    const poidsEmballage =
        obtenirPoidsEmballage(type);


    let nomEmballage =
        "Carton";


    switch (type) {

        case "petit-sachet":
            nomEmballage = "Petit sachet";
            break;

        case "sachet":
            nomEmballage = "Sachet";
            break;

        case "enveloppe":
            nomEmballage = "Enveloppe";
            break;

        case "petit-carton":
            nomEmballage = "Petit carton";
            break;

        case "carton":
            nomEmballage = "Carton";
            break;

        case "grand-carton":
            nomEmballage = "Grand carton";
            break;

    }


    const hauteurEmballage =
        H + marge * 2;

    const longueurEmballage =
        L + marge * 2;

    const largeurEmballage =
        l + marge * 2;


    emballageInfo.textContent =
        "📦 EMBALLAGE : " +
        nomEmballage;


    typeInfo.textContent =
        "🏷️ Type : " +
        nomEmballage;


    poidsInfo.textContent =
        "⚖️ Poids emballage : " +
        poidsEmballage.toFixed(3) +
        " kg";


    dimensionsInfo.textContent =
        "📏 Dimensions emballage : " +
        hauteurEmballage.toFixed(2) +
        " × " +
        longueurEmballage.toFixed(2) +
        " × " +
        largeurEmballage.toFixed(2) +
        " cm";

}


// ==========================================
// VOLUME MARITIME
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


// ==========================================
// DÉTECTION AUTOMATIQUE EMBALLAGE
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
        texte.includes("écouteur") ||
        texte.includes("ecouteur") ||
        texte.includes("airpods") ||
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
        texte.includes(" tv") ||
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
        texte.includes("samsung galaxy") ||
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
// EXTRAIRE POIDS DIAGNOSTIC
// ==========================================

function extrairePoidsDiagnostic(
    diagnostic
) {

    if (!Array.isArray(diagnostic)) {
        return null;
    }


    const candidats = [];


    diagnostic.forEach(function(item) {

        if (!item) {
            return;
        }


        const valeur =
            parseFloat(item.poids_trouve);


        if (
            Number.isFinite(valeur) &&
            valeur > 0 &&
            valeur < 100
        ) {

            candidats.push({

                poids: valeur,

                produitTrouve:
                    item.produit_trouve === true,

                numero:
                    item.numero || 999

            });

        }

    });


    if (candidats.length === 0) {
        return null;
    }


    candidats.sort(function(a, b) {

        if (
            a.produitTrouve !==
            b.produitTrouve
        ) {

            return b.produitTrouve ? 1 : -1;

        }


        return a.numero - b.numero;

    });


    return candidats[0].poids;

}


// ==========================================
// SOURCE DIAGNOSTIC
// ==========================================

function extraireSourceDiagnostic(
    diagnostic
) {

    if (!Array.isArray(diagnostic)) {
        return null;
    }


    for (const item of diagnostic) {

        if (!item) {
            continue;
        }


        if (
            item.url &&
            item.poids_trouve
        ) {

            return item.url;

        }

    }


    return null;

}


// ==========================================
// BOUTON CALCULER
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

                resultats.innerHTML = `
                    <p>
                        ⚠️ <strong>
                        Veuillez renseigner correctement
                        la hauteur, la longueur et la largeur.
                        </strong>
                    </p>
                `;

                return;

            }


            if (
                transport.value === "avion" &&
                (!P || P <= 0)
            ) {

                resultats.innerHTML = `
                    <p>
                        ⚠️ <strong>
                        Veuillez renseigner le poids réel.
                        </strong>
                    </p>
                `;

                return;

            }


            if (
                !Number.isFinite(prix) ||
                prix < 0
            ) {

                resultats.innerHTML = `
                    <p>
                        ⚠️ <strong>
                        Veuillez renseigner le prix de la marchandise en Yuan.
                        </strong>
                    </p>
                `;

                return;

            }


            const montantYuan =
                parseFloat(prixYuan.value) || 0;


            const tauxYuanUtilise =
                parseFloat(tauxYuan.value) ||
                TAUX_YUAN_AR_DEFAUT;


            const montantMarchandiseAR =
                montantYuan *
                tauxYuanUtilise;


            if (
                transport.value === "avion"
            ) {

                calculerAvion(
                    montantYuan,
                    montantMarchandiseAR
                );

            }

            else {

                calculerMaritime(
                    montantYuan,
                    montantMarchandiseAR
                );

            }

        }
    );

}


// ==========================================
// CALCUL AVION
// ==========================================

function calculerAvion(
    montantYuan,
    montantMarchandiseAR
) {

    const poidsProduit =
        parseFloat(poids?.value) || 0;


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


    let tarif = 0;

    let nomTarif = "";

    let jourDepart = "";

    let delai = "";


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
            ⚖️ Poids réel :
            <strong>
                ${poidsReel.toFixed(3)} kg
            </strong>
        </p>

        <p>
            📦 Poids volumétrique :
            <strong>
                ${poidsVolumetrique.toFixed(3)} kg
            </strong>
        </p>

        <p>
            💰 Poids facturable :
            <strong>
                ${poidsFacturable.toFixed(3)} kg
            </strong>
        </p>

        <p>
            💵 Tarif :
            <strong>
                ${tarif.toLocaleString("fr-FR")} AR/kg
            </strong>
        </p>

        <p>
            🚚 Frais de transport :
            <strong>
                ${fraisTransport.toLocaleString("fr-FR")} AR
            </strong>
        </p>

        <hr>

        <p>
            💴 Prix marchandise :
            <strong>
                ${montantYuan.toLocaleString("fr-FR")} Yuan
            </strong>
        </p>

        <p>
            💰 Valeur marchandise :
            <strong>
                ${montantMarchandiseAR.toLocaleString("fr-FR")} AR
            </strong>
        </p>

        <hr>

        <p>
            🧾 TOTAL :
            <strong>
                ${total.toLocaleString("fr-FR")} AR
            </strong>
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
// CALCUL MARITIME
// ==========================================

function calculerMaritime(
    montantYuan,
    montantMarchandiseAR
) {

    const volume =
        calculerVolumeMaritime();


    let tarif = 0;

    let nomTarif = "";


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

        resultats.innerHTML = `
            <p>
                ⚠️ Cette marchandise n'est pas disponible
                en transport maritime.
            </p>
        `;

        return;

    }


    const tauxDollarUtilise =
        parseFloat(tauxDollar?.value) || 0;


    if (
        tauxDollarUtilise <= 0
    ) {

        resultats.innerHTML = `
            <p>
                ⚠️ Veuillez saisir le
                <strong>taux Dollar → AR</strong>
                avant de calculer.
            </p>
        `;

        return;

    }


    const fraisDollar =
        volume * tarif;


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
            <strong>
                ${volume.toFixed(3)} m³
            </strong>
        </p>

        <p>
            💵 Tarif :
            <strong>
                ${tarif.toLocaleString("fr-FR")} $/m³
            </strong>
        </p>

        <p>
            🚢 Transport :
            <strong>
                ${fraisDollar.toLocaleString("fr-FR")} $
            </strong>
        </p>

        <p>
            💱 Taux Dollar :
            <strong>
                ${tauxDollarUtilise.toLocaleString("fr-FR")} AR/$
            </strong>
        </p>

        <p>
            🚢 Transport en AR :
            <strong>
                ${fraisTransportAR.toLocaleString("fr-FR")} AR
            </strong>
        </p>

        <hr>

        <p>
            💴 Prix marchandise :
            <strong>
                ${montantYuan.toLocaleString("fr-FR")} Yuan
            </strong>
        </p>

        <p>
            💰 Valeur marchandise :
            <strong>
                ${montantMarchandiseAR.toLocaleString("fr-FR")} AR
            </strong>
        </p>

        <hr>

        <p>
            🧾 TOTAL :
            <strong>
                ${total.toLocaleString("fr-FR")} AR
            </strong>
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
// CHANGEMENT TRANSPORT
// ==========================================

if (transport) {

    transport.addEventListener(
        "change",
        mettreAJourTransport
    );

    mettreAJourTransport();

}


// ==========================================
// CHANGEMENT EMBALLAGE
// ==========================================

if (choixEmballage) {

    choixEmballage.addEventListener(
        "change",
        function() {

            let emballageChoisi =
                choixEmballage.value;


            if (
                emballageChoisi === "auto"
            ) {

                emballageChoisi =
                    window.typeEmballageAuto ||
                    "carton";

            }


            window.typeEmballageAuto =
                emballageChoisi;


            calculerInformationsEmballage(
                emballageChoisi
            );


            const poidsFacturable =
                calculerPoidsFacturable(
                    emballageChoisi
                );


            const affichage =
                document.getElementById(
                    "poids-facturable-recherche"
                );


            if (
                affichage &&
                parseFloat(poids?.value) > 0 &&
                parseFloat(hauteur?.value) > 0 &&
                parseFloat(longueur?.value) > 0 &&
                parseFloat(largeur?.value) > 0
            ) {

                affichage.textContent =
                    "💰 Poids facturable : " +
                    poidsFacturable.toFixed(3) +
                    " kg";

            }

        }
    );

}


// ==========================================
// RÉINITIALISER
// ==========================================

function reinitialiser() {

    if (hauteur) hauteur.value = "";

    if (longueur) longueur.value = "";

    if (largeur) largeur.value = "";

    if (poids) poids.value = "";

    if (prixYuan) prixYuan.value = "";

    if (tauxYuan) tauxYuan.value = "670";

    if (tauxDollar) tauxDollar.value = "";


    if (resultats) {

        resultats.innerHTML = `
            <p>
                Remplissez les informations puis cliquez
                sur <strong>CALCULER</strong>.
            </p>
        `;

    }


    window.typeEmballageAuto =
        "carton";


    if (choixEmballage) {
        choixEmballage.value = "auto";
    }


    const champs = [

        "nom-produit",
        "recherche-produit"

    ];


    champs.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }

    });


    const idsTexte = {

        "source-produit":
            "🌐 Source : —",

        "produit-recherche-info":
            "📦 Produit recherché : —",

        "modele-recherche-info":
            "🏷️ Modèle : —",

        "statut-recherche-info":
            "ℹ️ Statut : —",

        "poids-recherche":
            "⚖️ Poids réel trouvé : —",

        "dimensions-recherche":
            "📏 Dimensions trouvées : —",

        "poids-facturable-recherche":
            "💰 Poids facturable : —",

        "emballage-recherche":
            "📦 EMBALLAGE : —",

        "type-emballage-info":
            "🏷️ Type : —",

        "poids-emballage-info":
            "⚖️ Poids emballage : —",

        "dimensions-emballage-info":
            "📏 Dimensions emballage : —",

        "etat-recherche-produit":
            ""

    };


    Object.keys(idsTexte).forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                idsTexte[id];

        }

    });


    if (apercuCapture) {
        apercuCapture.innerHTML = "";
    }


    if (captureProduit) {
        captureProduit.value = "";
    }

}


// ==========================================
// NUMÉRO DE DEVIS
// ==========================================

let numeroDevis = 0;


// ==========================================
// AJOUTER DEVIS
// ==========================================

function ajouterDevis() {

    const nomProduit =
        document.getElementById(
            "nom-produit"
        );

    const resultatsElement =
        document.getElementById(
            "resultats"
        );

    const listeDevis =
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

        if (nomProduit) {
            nomProduit.focus();
        }

        return;

    }


    if (
        !resultatsElement ||
        !resultatsElement.innerText.trim() ||
        resultatsElement.innerText.includes(
            "Remplissez les informations"
        )
    ) {

        alert(
            "⚠️ Veuillez d'abord effectuer un calcul."
        );

        return;

    }


    if (!listeDevis) {
        return;
    }


    numeroDevis++;


    const dateDevis =
        new Date().toLocaleDateString(
            "fr-FR"
        );


    const texteResultat =
        resultatsElement.innerText
            .replace(
                /📅 Départ :[^\n]*/g,
                ""
            )
            .replace(
                /⏱️ Délai :[^\n]*/g,
                ""
            )
            .replace(
                /\n{2,}/g,
                "\n"
            )
            .trim();


    if (numeroDevis === 1) {

        listeDevis.innerText =
`════════════════════════════════
         DEVIS EXPÉDITION
════════════════════════════════

Date : ${dateDevis}

1) 📦 Nom du produit : ${nomProduit.value.trim()}
${texteResultat}

`;

    }

    else {

        listeDevis.innerText +=
`────────────────────────────────
${numeroDevis}) 📦 Nom du produit : ${nomProduit.value.trim()}
${texteResultat}

`;

    }


    listeDevis.scrollTop =
        listeDevis.scrollHeight;


    localStorage.setItem(
        "devisExpedition",
        listeDevis.innerText
    );

}


// ==========================================
// EFFACER DEVIS
// ==========================================

function effacerDevis() {

    const listeDevis =
        document.getElementById(
            "liste-devis"
        );


    if (
        !listeDevis ||
        !listeDevis.innerText.trim()
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


    listeDevis.innerText = "";

    numeroDevis = 0;


    localStorage.removeItem(
        "devisExpedition"
    );

}


// ==========================================
// COPIER DEVIS
// ==========================================

async function copierDevis() {

    const listeDevis =
        document.getElementById(
            "liste-devis"
        );


    if (
        !listeDevis ||
        !listeDevis.innerText.trim()
    ) {

        alert(
            "ℹ️ Aucun devis à copier."
        );

        return;

    }


    try {

        await navigator.clipboard.writeText(
            listeDevis.innerText.trim()
        );


        alert(
            "✅ Tous les devis ont été copiés."
        );

    }

    catch (erreur) {

        console.error(erreur);

        alert(
            "⚠️ Impossible de copier les devis."
        );

    }

}


// ==========================================
// IMPRIMER DEVIS
// ==========================================

function imprimerDevis() {

    const listeDevis =
        document.getElementById(
            "liste-devis"
        );


    if (
        !listeDevis ||
        !listeDevis.innerText.trim()
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
            "⚠️ La fenêtre d'impression a été bloquée."
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

    line-height:1.4;

    white-space:pre-wrap;

    padding:30px;

}

</style>

</head>

<body>

${listeDevis.innerText}

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
// AFFICHER / MASQUER DEVIS
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


    if (!bloc) {
        return;
    }


    if (
        bloc.style.display === "none" ||
        bloc.style.display === ""
    ) {

        bloc.style.display = "block";


        if (bouton) {

            bouton.innerHTML =
                "📄 MASQUER LES DEVIS";

        }


        bloc.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

    else {

        bloc.style.display = "none";


        if (bouton) {

            bouton.innerHTML =
                "📄 DEVIS";

        }

    }

}


// ==========================================
// CHARGER DEVIS
// ==========================================

window.addEventListener(
    "DOMContentLoaded",
    function() {

        const listeDevis =
            document.getElementById(
                "liste-devis"
            );


        if (!listeDevis) {
            return;
        }


        const sauvegarde =
            localStorage.getItem(
                "devisExpedition"
            );


        if (
            sauvegarde &&
            sauvegarde.trim()
        ) {

            listeDevis.innerText =
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


// ==========================================
// CAPTURE PRODUIT
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

            if (
                !this.files ||
                !this.files[0]
            ) {

                return;

            }


            const fichier =
                this.files[0];


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
        alt="Aperçu de la capture du produit"
    >

    <button
        type="button"
        id="supprimer-capture"
    >
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

            const recherche =
                document.getElementById(
                    "recherche-produit"
                );

            const source =
                document.getElementById(
                    "source-produit"
                );

            const poidsAffichage =
                document.getElementById(
                    "poids-recherche"
                );

            const dimensionsAffichage =
                document.getElementById(
                    "dimensions-recherche"
                );

            const etat =
                document.getElementById(
                    "etat-recherche-produit"
                );

            const poidsFacturableAffichage =
                document.getElementById(
                    "poids-facturable-recherche"
                );

            const produitAffichage =
                document.getElementById(
                    "produit-recherche-info"
                );

            const modeleAffichage =
                document.getElementById(
                    "modele-recherche-info"
                );

            const statutAffichage =
                document.getElementById(
                    "statut-recherche-info"
                );


            const texte =
                recherche
                    ? recherche.value.trim()
                    : "";


            if (!texte) {

                if (source) {
                    source.textContent =
                        "🌐 Source : Aucune recherche";
                }

                if (produitAffichage) {
                    produitAffichage.textContent =
                        "📦 Produit recherché : —";
                }

                if (modeleAffichage) {
                    modeleAffichage.textContent =
                        "🏷️ Modèle : —";
                }

                if (statutAffichage) {
                    statutAffichage.textContent =
                        "ℹ️ Statut : —";
                }

                if (poidsAffichage) {
                    poidsAffichage.textContent =
                        "⚖️ Poids réel trouvé : Non disponible";
                }

                if (dimensionsAffichage) {
                    dimensionsAffichage.textContent =
                        "📏 Dimensions trouvées : Non disponibles";
                }

                if (poidsFacturableAffichage) {
                    poidsFacturableAffichage.textContent =
                        "💰 Poids facturable : Non calculable";
                }

                if (etat) {
                    etat.textContent =
                        "⚠️ Veuillez indiquer un produit ou un lien.";
                }

                return;

            }


            if (produitAffichage) {

                produitAffichage.textContent =
                    "📦 Produit recherché : " +
                    texte;

            }


            if (etat) {

                etat.textContent =
                    "🔎 Recherche en cours...";

            }


            if (poidsAffichage) {

                poidsAffichage.textContent =
                    "⚖️ Poids réel trouvé : Recherche...";

            }


            if (dimensionsAffichage) {

                dimensionsAffichage.textContent =
                    "📏 Dimensions trouvées : Recherche...";

            }


            const urlAPI =
                URL_WORKER +
                "?produit=" +
                encodeURIComponent(texte);


            console.log(
                "RECHERCHE :",
                texte
            );

            console.log(
                "WORKER :",
                urlAPI
            );


            try {

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
                    "RÉPONSE WORKER :",
                    donnees
                );


                if (!donnees.succes) {

                    throw new Error(
                        donnees.message ||
                        "Erreur de recherche"
                    );

                }


                // ==================================
                // SOURCE
                // ==================================

                let sourceFinale =
                    donnees.source ||
                    null;


                if (!sourceFinale) {

                    sourceFinale =
                        extraireSourceDiagnostic(
                            donnees.diagnostic
                        );

                }


                if (source) {

                    source.textContent =
                        "🌐 Source : " +
                        (
                            sourceFinale ||
                            "Non disponible"
                        );

                }


                // ==================================
                // PRODUIT
                // ==================================

                if (produitAffichage) {

                    produitAffichage.textContent =
                        "📦 Produit recherché : " +
                        (
                            donnees.produit ||
                            texte
                        );

                }


                // ==================================
                // MODÈLE
                // ==================================

                if (modeleAffichage) {

                    modeleAffichage.textContent =
                        "🏷️ Modèle : " +
                        (
                            donnees.modele ||
                            "—"
                        );

                }


                // ==================================
                // POIDS
                // ==================================

                let poidsTrouve =
                    null;


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
                        valeur > 0 &&
                        valeur < 100
                    ) {

                        poidsTrouve =
                            valeur;

                    }

                }


                if (
                    poidsTrouve === null
                ) {

                    poidsTrouve =
                        extrairePoidsDiagnostic(
                            donnees.diagnostic
                        );

                }


                // ==================================
                // AFFICHAGE POIDS
                // ==================================

                if (
                    poidsTrouve !== null
                ) {

                    if (poidsAffichage) {

                        poidsAffichage.textContent =
                            "⚖️ Poids réel trouvé : " +
                            poidsTrouve.toFixed(3) +
                            " kg";

                    }


                    if (poids) {

                        poids.value =
                            poidsTrouve.toFixed(3);

                    }

                }

                else {

                    if (poidsAffichage) {

                        poidsAffichage.textContent =
                            "⚖️ Poids réel trouvé : Non disponible";

                    }

                }


                // ==================================
                // EMBALLAGE
                // ==================================

                const typeDetecte =
                    detecterEmballageAutomatique(
                        texte
                    );


                let emballageFinal =
                    typeDetecte;


                if (
                    choixEmballage &&
                    choixEmballage.value &&
                    choixEmballage.value !== "auto"
                ) {

                    emballageFinal =
                        choixEmballage.value;

                }


                window.typeEmballageAuto =
                    emballageFinal;


                calculerInformationsEmballage(
                    emballageFinal
                );


                // ==================================
                // DIMENSIONS
                // ==================================

                let dimensionsTrouvees =
                    false;


                if (donnees.dimensions) {

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
                        Number.isFinite(h) &&
                        Number.isFinite(lo) &&
                        Number.isFinite(la) &&
                        h > 0 &&
                        lo > 0 &&
                        la > 0
                    ) {

                        dimensionsTrouvees =
                            true;


                        if (dimensionsAffichage) {

                            dimensionsAffichage.textContent =
                                "📏 Dimensions trouvées : " +
                                h.toFixed(2) +
                                " × " +
                                lo.toFixed(2) +
                                " × " +
                                la.toFixed(2) +
                                " cm";

                        }


                        if (hauteur) {
                            hauteur.value = h;
                        }

                        if (longueur) {
                            longueur.value = lo;
                        }

                        if (largeur) {
                            largeur.value = la;
                        }

                    }

                }


                if (
                    !dimensionsTrouvees &&
                    dimensionsAffichage
                ) {

                    dimensionsAffichage.textContent =
                        "📏 Dimensions trouvées : Non disponibles";

                }


                // ==================================
                // POIDS FACTURABLE
                // ==================================

                if (
                    poidsTrouve !== null &&
                    parseFloat(hauteur?.value) > 0 &&
                    parseFloat(longueur?.value) > 0 &&
                    parseFloat(largeur?.value) > 0
                ) {

                    const poidsFacturable =
                        calculerPoidsFacturable(
                            emballageFinal
                        );


                    if (poidsFacturableAffichage) {

                        poidsFacturableAffichage.textContent =
                            "💰 Poids facturable : " +
                            poidsFacturable.toFixed(3) +
                            " kg";

                    }

                }

                else {

                    if (poidsFacturableAffichage) {

                        poidsFacturableAffichage.textContent =
                            "💰 Poids facturable : Non calculable";

                    }

                }


                // ==================================
                // STATUT
                // ==================================

                if (statutAffichage) {

                    statutAffichage.textContent =
                        "ℹ️ Statut : " +
                        (
                            donnees.statut ||
                            (
                                poidsTrouve !== null
                                    ? "Informations trouvées"
                                    : "Poids non trouvé"
                            )
                        );

                }


                // ==================================
                // ÉTAT
                // ==================================

                if (etat) {

                    if (poidsTrouve !== null) {

                        etat.textContent =
                            "✅ Recherche effectuée pour : " +
                            texte;

                    }

                    else {

                        etat.textContent =
                            "⚠️ Produit trouvé, mais poids non disponible.";

                    }

                }


                console.log(
                    "POIDS FINAL :",
                    poidsTrouve
                );

                console.log(
                    "EMBALLAGE :",
                    emballageFinal
                );

                console.log(
                    "SOURCE :",
                    sourceFinale
                );

            }


            catch (erreur) {

                console.error(
                    "Erreur recherche produit :",
                    erreur
                );


                if (source) {

                    source.textContent =
                        "🌐 Source : Erreur";

                }

                if (poidsAffichage) {

                    poidsAffichage.textContent =
                        "⚖️ Poids réel trouvé : Non disponible";

                }

                if (dimensionsAffichage) {

                    dimensionsAffichage.textContent =
                        "📏 Dimensions trouvées : Non disponibles";

                }

                if (poidsFacturableAffichage) {

                    poidsFacturableAffichage.textContent =
                        "💰 Poids facturable : Non calculable";

                }

                if (statutAffichage) {

                    statutAffichage.textContent =
                        "ℹ️ Statut : Erreur de recherche";

                }

                if (etat) {

                    etat.textContent =
                        "❌ Impossible d'effectuer la recherche.";

                }

            }

        }
    );

}
