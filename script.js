// ==========================================
// CALCULATEUR D'EXPÉDITION
// ==========================================


// ==========================================
// PARAMÈTRES
// ==========================================

const TAUX_YUAN_AR_DEFAUT = 670;


// ==========================================
// URL DU WORKER
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
// AFFICHER / CACHER LES CHAMPS
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

    } else {

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
// CALCUL POIDS VOLUMÉTRIQUE
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


    let marge = 0;


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

        default:
            marge = 3;
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
// POIDS DE L'EMBALLAGE
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
// CALCUL POIDS FACTURABLE
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
            "🏷️ Type : Dimensions du produit nécessaires";

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


    // Petits accessoires

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


    // Documents / petits objets plats

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


    // Gros produits

    if (
        texte.includes("ordinateur") ||
        texte.includes("pc portable") ||
        texte.includes("laptop") ||
        texte.includes("écran") ||
        texte.includes("ecran") ||
        texte.includes("moniteur") ||
        texte.includes("télévision") ||
        texte.includes("television") ||
        texte.includes("tv") ||
        texte.includes("imprimante") ||
        texte.includes("réfrigérateur") ||
        texte.includes("refrigerateur") ||
        texte.includes("micro-onde") ||
        texte.includes("micro onde")
    ) {

        return "grand-carton";

    }


    // Téléphones et tablettes

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


    // Chaussures

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


    // Vêtements

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


    // Défaut

    return "carton";

}


// ==========================================
// EXTRAIRE LE MEILLEUR POIDS DU DIAGNOSTIC
// ==========================================

function extrairePoidsDiagnostic(
    diagnostic
) {

    if (
        !Array.isArray(diagnostic)
    ) {

        return null;
    }


    const candidats = [];


    diagnostic.forEach(function(item) {

        if (!item) {
            return;
        }


        const poidsTrouve =
            parseFloat(
                item.poids_trouve
            );


        if (
            Number.isFinite(poidsTrouve) &&
            poidsTrouve > 0
        ) {

            candidats.push({

                poids: poidsTrouve,

                produitTrouve:
                    item.produit_trouve === true,

                numero:
                    item.numero || 999

            });

        }

    });


    if (
        candidats.length === 0
    ) {

        return null;
    }


    // Priorité :
    // 1. Produit identifié
    // 2. Poids trouvé

    candidats.sort(function(a, b) {

        function score(x) {

            let valeur = 0;

            if (x.produitTrouve) {
                valeur += 10;
            }

            return valeur;
        }


        const difference =
            score(b) -
            score(a);


        if (
            difference !== 0
        ) {

            return difference;

        }


        return a.numero -
            b.numero;

    });


    return candidats[0].poids;

}


// ==========================================
// EXTRAIRE SOURCE DU DIAGNOSTIC
// ==========================================

function extraireSourceDiagnostic(
    diagnostic
) {

    if (
        !Array.isArray(diagnostic)
    ) {

        return null;
    }


    for (
        const item of diagnostic
    ) {

        if (!item) {
            continue;
        }


        if (
            item.poids_trouve !== null &&
            item.poids_trouve !== undefined
        ) {

            if (item.url) {

                return item.url;

            }

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
                parseFloat(
                    hauteur?.value
                );

            const L =
                parseFloat(
                    longueur?.value
                );

            const l =
                parseFloat(
                    largeur?.value
                );

            const P =
                parseFloat(
                    poids?.value
                );

            const prix =
                parseFloat(
                    prixYuan?.value
                );


            // Vérification dimensions

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
                        la hauteur, la longueur
                        et la largeur.
                        </strong>
                    </p>

                `;

                return;
            }


            // Vérification poids avion

            if (
                transport.value === "avion" &&
                (!P || P <= 0)
            ) {

                resultats.innerHTML = `

                    <p>
                        ⚠️ <strong>
                        Veuillez renseigner
                        le poids réel.
                        </strong>
                    </p>

                `;

                return;
            }


            // Vérification prix

            if (
                !prix ||
                prix < 0
            ) {

                resultats.innerHTML = `

                    <p>
                        ⚠️ <strong>
                        Veuillez renseigner
                        le prix de la marchandise
                        en Yuan.
                        </strong>
                    </p>

                `;

                return;
            }


            const montantYuan =
                parseFloat(
                    prixYuan.value
                ) || 0;


            const tauxYuanUtilise =
                parseFloat(
                    tauxYuan.value
                ) ||
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

            else if (
                transport.value === "maritime"
            ) {

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
        parseFloat(
            poids?.value
        ) || 0;


    const typeEmballageAuto =
        window.typeEmballageAuto ||
        "carton";


    const poidsEmballage =
        obtenirPoidsEmballage(
            typeEmballageAuto
        );


    const poidsReel =
        poidsProduit +
        poidsEmballage;


    const poidsVolumetrique =
        calculerPoidsVolumetrique(
            typeEmballageAuto
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

    else if (
        marchandise.value === "poudre"
    ) {

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

        <h3>
            ✈️ TRANSPORT : AVION
        </h3>

        <p>
            📦 Type :
            <strong>
                ${nomTarif}
            </strong>
        </p>

        <p>
            ⚖️ Poids réel :
            <strong>
                ${poidsReel.toFixed(2)}
                kg
            </strong>
        </p>

        <p>
            📦 Poids volumétrique :
            <strong>
                ${poidsVolumetrique.toFixed(2)}
                kg
            </strong>
        </p>

        <p>
            💰 Poids facturable :
            <strong>
                ${poidsFacturable.toFixed(2)}
                kg
            </strong>
        </p>

        <p>
            💵 Tarif :
            <strong>
                ${tarif.toLocaleString("fr-FR")}
                AR/kg
            </strong>
        </p>

        <p>
            🚚 Frais de transport :
            <strong>
                ${fraisTransport.toLocaleString("fr-FR")}
                AR
            </strong>
        </p>

        <hr>

        <p>
            💴 Prix marchandise :
            <strong>
                ${montantYuan.toLocaleString("fr-FR")}
                Yuan
            </strong>
        </p>

        <p>
            💰 Valeur marchandise :
            <strong>
                ${montantMarchandiseAR.toLocaleString("fr-FR")}
                AR
            </strong>
        </p>

        <hr>

        <p>
            🧾 TOTAL :
            <strong>
                ${total.toLocaleString("fr-FR")}
                AR
            </strong>
        </p>

        <p>
            📅 Départ :
            <strong>
                ${jourDepart}
            </strong>
        </p>

        <p>
            ⏱️ Délai :
            <strong>
                ${delai}
            </strong>
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
                ⚠️ Cette marchandise
                n'est pas disponible
                en transport maritime.
            </p>

        `;

        return;

    }


    const tauxDollarUtilise =
        parseFloat(
            tauxDollar?.value
        ) || 0;


    if (
        tauxDollarUtilise <= 0
    ) {

        resultats.innerHTML = `

            <p>
                ⚠️ Veuillez saisir le
                <strong>
                    taux Dollar → AR
                </strong>
                avant de calculer.
            </p>

        `;

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

        <h3>
            🚢 TRANSPORT : MARITIME
        </h3>

        <p>
            📦 Type :
            <strong>
                ${nomTarif}
            </strong>
        </p>

        <p>
            📐 Volume :
            <strong>
                ${volume.toFixed(3)}
                m³
            </strong>
        </p>

        <p>
            💵 Tarif :
            <strong>
                ${tarif.toLocaleString("fr-FR")}
                $/m³
            </strong>
        </p>

        <p>
            🚢 Transport :
            <strong>
                ${fraisDollar.toLocaleString("fr-FR")}
                $
            </strong>
        </p>

        <p>
            💱 Taux Dollar :
            <strong>
                ${tauxDollarUtilise.toLocaleString("fr-FR")}
                AR/$
            </strong>
        </p>

        <p>
            🚢 Transport en AR :
            <strong>
                ${fraisTransportAR.toLocaleString("fr-FR")}
                AR
            </strong>
        </p>

        <hr>

        <p>
            💴 Prix marchandise :
            <strong>
                ${montantYuan.toLocaleString("fr-FR")}
                Yuan
            </strong>
        </p>

        <p>
            💰 Valeur marchandise :
            <strong>
                ${montantMarchandiseAR.toLocaleString("fr-FR")}
                AR
            </strong>
        </p>

        <hr>

        <p>
            🧾 TOTAL :
            <strong>
                ${total.toLocaleString("fr-FR")}
                AR
            </strong>
        </p>

        <p>
            📅 Départ :
            <strong>
                Tous les vendredis
            </strong>
        </p>

        <p>
            ⏱️ Délai :
            <strong>
                45 à 60 jours
            </strong>
        </p>

    `;

}


// ==========================================
// INITIALISATION TRANSPORT
// ==========================================

if (transport) {

    transport.addEventListener(
        "change",
        mettreAJourTransport
    );

    mettreAJourTransport();

}


// ==========================================
// CHANGEMENT MANUEL EMBALLAGE
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


            const poidsFacturableRecherche =
                document.getElementById(
                    "poids-facturable-recherche"
                );


            if (
                poidsFacturableRecherche
            ) {

                poidsFacturableRecherche.textContent =
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

    if (hauteur) {
        hauteur.value = "";
    }

    if (longueur) {
        longueur.value = "";
    }

    if (largeur) {
        largeur.value = "";
    }

    if (poids) {
        poids.value = "";
    }

    if (prixYuan) {
        prixYuan.value = "";
    }

    if (tauxYuan) {
        tauxYuan.value = "670";
    }

    if (tauxDollar) {
        tauxDollar.value = "";
    }


    if (resultats) {
        resultats.innerHTML = "";
    }


    window.typeEmballageAuto =
        "carton";


    if (choixEmballage) {
        choixEmballage.value = "auto";
    }


    const nomProduit =
        document.getElementById(
            "nom-produit"
        );


    if (nomProduit) {
        nomProduit.value = "";
    }


    const rechercheProduit =
        document.getElementById(
            "recherche-produit"
        );


    if (rechercheProduit) {
        rechercheProduit.value = "";
    }


    const apercuCapture =
        document.getElementById(
            "apercu-capture"
        );


    if (apercuCapture) {
        apercuCapture.innerHTML = "";
    }


    const captureProduit =
        document.getElementById(
            "capture-produit"
        );


    if (captureProduit) {
        captureProduit.value = "";
    }

}


// ==========================================
// NUMÉRO DE DEVIS
// ==========================================

let numeroDevis = 0;


// ==========================================
// AJOUTER UN DEVIS
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
        !resultatsElement.innerText.trim()
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


    const maintenant =
        new Date();


    const dateDevis =
        maintenant.toLocaleDateString(
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


    if (
        numeroDevis === 1
    ) {

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


    const confirmation =
        confirm(
            "⚠️ Voulez-vous vraiment effacer tous les devis ?"
        );


    if (!confirmation) {
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

        alert(
            "⚠️ Impossible de copier les devis."
        );


        console.error(erreur);

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


    const contenuDevis =
        listeDevis.innerText.trim();


    const fenetreImpression =
        window.open(
            "",
            "_blank",
            "width=800,height=600"
        );


    if (!fenetreImpression) {

        alert(
            "⚠️ La fenêtre d'impression a été bloquée par le navigateur."
        );

        return;
    }


    fenetreImpression.document.write(`

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

    font-size: 14px;

    line-height: 1.4;

    white-space: pre-wrap;

    padding: 30px;

}

</style>

</head>

<body>

<div>
${contenuDevis}
</div>

</body>

</html>

`);


    fenetreImpression.document.close();


    fenetreImpression.focus();


    setTimeout(
        function() {

            fenetreImpression.print();

        },
        300
    );

}


// ==========================================
// AFFICHER / MASQUER DEVIS
// ==========================================

function afficherMasquerDevis() {

    const blocDevis =
        document.getElementById(
            "bloc-devis"
        );

    const boutonDevis =
        document.getElementById(
            "btnAfficherDevis"
        );


    if (!blocDevis) {
        return;
    }


    if (
        blocDevis.style.display === "none"
    ) {

        blocDevis.style.display =
            "block";


        if (boutonDevis) {

            boutonDevis.innerHTML =
                "📄 MASQUER LES DEVIS";

        }


        blocDevis.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

    else {

        blocDevis.style.display =
            "none";


        if (boutonDevis) {

            boutonDevis.innerHTML =
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


        const devisSauvegardes =
            localStorage.getItem(
                "devisExpedition"
            );


        if (
            devisSauvegardes &&
            devisSauvegardes.trim()
        ) {

            listeDevis.innerText =
                devisSauvegardes;


            const correspondances =
                devisSauvegardes.match(
                    /^\d+\) 📦 Nom du produit :/gm
                );


            if (correspondances) {

                numeroDevis =
                    correspondances.length;

            }

        }

    }
);

// =====================================================
// 📷 CAPTURE PRODUIT + OCR
// =====================================================

const captureProduit =
    document.getElementById("capture-produit");

const apercuCapture =
    document.getElementById("apercu-capture");

const etatRechercheProduit =
    document.getElementById("etat-recherche-produit");


if (captureProduit && apercuCapture) {

    captureProduit.addEventListener(
        "change",
        async function () {

            const fichier = this.files?.[0];

            if (!fichier) {
                return;
            }


            // ==========================================
            // VÉRIFICATION IMAGE
            // ==========================================

            if (!fichier.type.startsWith("image/")) {

                apercuCapture.innerHTML =
                    "<p>❌ Veuillez sélectionner une image.</p>";

                return;
            }


            // ==========================================
            // AFFICHER L'IMAGE
            // ==========================================

            const lecteur =
                new FileReader();

        lecteur.onload =
    function (e) {

        apercuCapture.innerHTML = `

            <div class="cadre-apercu-capture">

                <p>
                    📸 Capture sélectionnée :
                </p>

                <img
                    id="image-capture-produit"
                    src="${e.target.result}"
                    alt="Capture du produit"
                    style="
                        max-width:100%;
                        height:auto;
                        display:block;
                        margin:auto;
                    "
                >

                <br>

                <button
                    type="button"
                    id="analyser-capture">

                    🤖 ANALYSER LA CAPTURE

                </button>

                <br><br>

                <button
                    type="button"
                    id="supprimer-capture">

                    🗑️ SUPPRIMER LA CAPTURE

                </button>

            </div>

        `;

                    const boutonSupprimer =
                        document.getElementById(
                            "supprimer-capture"
                        );


                    if (boutonSupprimer) {

                        boutonSupprimer.addEventListener(
                            "click",
                            function () {

                                captureProduit.value = "";

                                apercuCapture.innerHTML = "";

                                if (etatRechercheProduit) {

                                    etatRechercheProduit.textContent =
                                        "";

                                }

                            }
                        );

                    }

                };


            lecteur.readAsDataURL(fichier);


            // ==========================================
            // VÉRIFIER TESSERACT
            // ==========================================

            if (
                typeof Tesseract === "undefined"
            ) {

                if (etatRechercheProduit) {

                    etatRechercheProduit.textContent =
                        "❌ Le système OCR n'est pas chargé.";

                }

                console.error(
                    "Tesseract.js non chargé."
                );

                return;
            }


            // ==========================================
            // DÉBUT OCR
            // ==========================================

            if (etatRechercheProduit) {

                etatRechercheProduit.textContent =
                    "🔎 Lecture du texte de la capture...";

            }


            try {

                const resultatOCR =
                    await Tesseract.recognize(
                        fichier,
                        "eng+fra",
                        {

                            logger: function (info) {

                                console.log(
                                    "OCR :",
                                    info
                                );


                                if (
                                    etatRechercheProduit &&
                                    info.status ===
                                        "recognizing text"
                                ) {

                                    const progression =
                                        Math.round(
                                            (info.progress || 0) *
                                            100
                                        );


                                    etatRechercheProduit.textContent =
                                        "🔎 Lecture de la capture : " +
                                        progression +
                                        "%";

                                }

                            }

                        }
                    );


                // ==========================================
                // TEXTE OCR
                // ==========================================

                const texteOCR =
                    resultatOCR.data.text
                        .replace(/\s+/g, " ")
                        .trim();


                console.log(
                    "================================="
                );

                console.log(
                    "TEXTE OCR :",
                    texteOCR
                );

                console.log(
                    "================================="
                );


                if (!texteOCR) {

                    if (etatRechercheProduit) {

                        etatRechercheProduit.textContent =
                            "⚠️ Aucun texte détecté dans la capture.";

                    }

                    return;
                }


                // ==========================================
                // REMPLIR LE CHAMP RECHERCHE
                // ==========================================

                const rechercheProduit =
                    document.getElementById(
                        "recherche-produit"
                    );


                if (rechercheProduit) {

                    rechercheProduit.value =
                        texteOCR;


                    rechercheProduit.dispatchEvent(
                        new Event(
                            "input",
                            {
                                bubbles: true
                            }
                        )
                    );

                }


                // ==========================================
                // ÉTAT FINAL
                // ==========================================

                if (etatRechercheProduit) {

                    etatRechercheProduit.innerHTML =
                        "✅ Texte détecté dans la capture.<br>" +
                        "🔎 Vérifiez le texte puis cliquez sur RECHERCHER.";

                }

            }
            catch (erreur) {

                console.error(
                    "Erreur OCR :",
                    erreur
                );


                if (etatRechercheProduit) {

                    etatRechercheProduit.textContent =
                        "❌ Impossible de lire le texte de la capture.";

                }

            }

        }
    );

}

// =====================================================
// RECHERCHE INFORMATIONS PRODUIT
// =====================================================

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

            const etatRechercheProduit =
                document.getElementById(
                    "etat-recherche-produit"
                );

            const poidsFacturableRecherche =
                document.getElementById(
                    "poids-facturable-recherche"
                );

            const produitRechercheAffiche =
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
    
            // ==========================================
            // TEXTE DE RECHERCHE
            // ==========================================

            const texteRecherche =
                rechercheProduit
                    ? rechercheProduit.value.trim()
                    : "";


            if (
                texteRecherche === ""
            ) {

                if (sourceProduit) {

                    sourceProduit.textContent =
                        "🌐 Source : Aucune recherche";

                }


                if (poidsRecherche) {

                    poidsRecherche.textContent =
                        "⚖️ Poids réel trouvé : Non disponible";

                }


                if (dimensionsRecherche) {

                    dimensionsRecherche.textContent =
                        "📏 Dimensions trouvées : Non disponibles";

                }


                if (poidsFacturableRecherche) {

                    poidsFacturableRecherche.textContent =
                        "💰 Poids facturable : Non calculable";

                }


                if (produitRechercheAffiche) {

                    produitRechercheAffiche.textContent =
                        "📦 Produit recherché : —";

                }

                if (modeleAffiche) {

                    modeleAffiche.textContent =
                        "🏷️ Modèle : —";

                }


                if (statutAffiche) {

                    statutAffiche.textContent =
                        "ℹ️ Statut : —";

                }


                if (etatRechercheProduit) {

                    etatRechercheProduit.textContent =
                        "⚠️ Veuillez indiquer un produit ou un lien.";

                }


                return;
            }


            // ==========================================
            // AFFICHAGE IMMÉDIAT
            // ==========================================

            if (
                produitRechercheAffiche
            ) {

                produitRechercheAffiche.textContent =
                    "📦 Produit recherché : " +
                    texteRecherche;

            }


            if (
                etatRechercheProduit
            ) {

                etatRechercheProduit.textContent =
                    "🔎 Recherche en cours...";

            }

// ==========================================
// POINTURE
// ==========================================

const champPointure =
    document.getElementById("pointure");

const pointureRecherchee =
    champPointure
        ? champPointure.value.trim()
        : "";


// ==========================================
// CONSTRUCTION URL WORKER
// ==========================================

let urlAPI =
    URL_WORKER +
    "?produit=" +
    encodeURIComponent(
        texteRecherche
    );


if (pointureRecherchee) {

    urlAPI +=
        "&pointure=" +
        encodeURIComponent(
            pointureRecherchee
        );

}


console.log(
    "POINTURE :",
    pointureRecherchee || "Aucune"
);
            
            console.log(
                "========================================"
            );

            console.log(
                "RECHERCHE :",
                texteRecherche
            );

            console.log(
                "URL WORKER :",
                urlAPI
            );

            console.log(
                "========================================"
            );


            // ==========================================
            // APPEL WORKER
            // ==========================================

            try {

                const response =
                    await fetch(
                        urlAPI,
                        {
                            method: "GET",
                            cache: "no-store"
                        }
                    );


                if (
                    !response.ok
                ) {

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


                if (
                    !donnees.succes
                ) {

                    throw new Error(
                        donnees.message ||
                        "Erreur lors de la recherche"
                    );

                }


                // ==========================================
                // SOURCE
                // ==========================================

                let sourceFinale =
                    donnees.source ||
                    null;


                if (
                    !sourceFinale
                ) {

                    sourceFinale =
                        extraireSourceDiagnostic(
                            donnees.diagnostic
                        );

                }


                if (
                    sourceProduit
                ) {

                    sourceProduit.textContent =
                        "🌐 Source : " +
                        (
                            sourceFinale ||
                            "Non disponible"
                        );

                }


                // ==========================================
                // PRODUIT
                // ==========================================

                if (
                    produitRechercheAffiche
                ) {

                    produitRechercheAffiche.textContent =
                        "📦 Produit recherché : " +
                        (
                            donnees.produit ||
                            texteRecherche
                        );

                }

                // ==========================================
                // MODÈLE
                // ==========================================

                if (
                    modeleAffiche
                ) {

                    modeleAffiche.textContent =
                        "🏷️ Modèle : " +
                        (
                            donnees.modele ||
                            "—"
                        );

                }

                // ==========================================
                // POIDS
                // ==========================================

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
                        valeur > 0
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


                if (
                    poidsTrouve !== null
                ) {

                    if (
                        poidsRecherche
                    ) {

                        poidsRecherche.textContent =
                            "⚖️ Poids réel trouvé : " +
                            poidsTrouve.toFixed(3) +
                            " kg";

                    }


                    if (poids) {

                        poids.value =
                            poidsTrouve;

                    }

                }

                else {

                    if (
                        poidsRecherche
                    ) {

                        poidsRecherche.textContent =
                            "⚖️ Poids réel trouvé : Non disponible";

                    }

                }


                // ==========================================
                // DÉTECTION EMBALLAGE
                // ==========================================

                const typeDetecte =
                    detecterEmballageAutomatique(
                        texteRecherche
                    );


                window.typeEmballageAuto =
                    typeDetecte;


                // ==========================================
                // DIMENSIONS
                // ==========================================

                let dimensionsTrouvees =
                    false;


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
                        Number.isFinite(h) &&
                        Number.isFinite(lo) &&
                        Number.isFinite(la) &&
                        h > 0 &&
                        lo > 0 &&
                        la > 0
                    ) {

                        dimensionsTrouvees =
                            true;


                        if (
                            dimensionsRecherche
                        ) {

                            dimensionsRecherche.textContent =
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
                    dimensionsRecherche
                ) {

                    dimensionsRecherche.textContent =
                        "📏 Dimensions trouvées : Non disponibles";

                }


                // ==========================================
                // CHOIX EMBALLAGE
                // ==========================================

                let emballageFinal =
                    "auto";


                if (
                    choixEmballage &&
                    choixEmballage.value &&
                    choixEmballage.value !== "auto"
                ) {

                    emballageFinal =
                        choixEmballage.value;

                }

                else {

                    emballageFinal =
                        typeDetecte;

                }


                window.typeEmballageAuto =
                    emballageFinal;


                // ==========================================
                // AFFICHER EMBALLAGE
                // ==========================================

                calculerInformationsEmballage(
                    emballageFinal
                );


                // ==========================================
                // POIDS FACTURABLE
                // ==========================================

                if (
                    poidsTrouve !== null &&
                    hauteur &&
                    longueur &&
                    largeur &&
                    parseFloat(hauteur.value) > 0 &&
                    parseFloat(longueur.value) > 0 &&
                    parseFloat(largeur.value) > 0
                ) {

                    const poidsFacturable =
                        calculerPoidsFacturable(
                            emballageFinal
                        );


                    if (
                        poidsFacturableRecherche
                    ) {

                        poidsFacturableRecherche.textContent =
                            "💰 Poids facturable : " +
                            poidsFacturable.toFixed(3) +
                            " kg";

                    }

                }

                else {

                    if (
                        poidsFacturableRecherche
                    ) {

                        poidsFacturableRecherche.textContent =
                            "💰 Poids facturable : Non calculable";

                    }

                }


                // ==========================================
                // STATUT
                // ==========================================

                if (
                    statutAffiche
                ) {

                    statutAffiche.textContent =
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


                // ==========================================
                // ÉTAT FINAL
                // ==========================================

                if (
                    etatRechercheProduit
                ) {

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


                console.log(
                    "POIDS FINAL UTILISÉ :",
                    poidsTrouve
                );

                console.log(
                    "EMBALLAGE FINAL :",
                    emballageFinal
                );

                console.log(
                    "SOURCE FINALE :",
                    sourceFinale
                );

            }


            catch (erreur) {

                console.error(
                    "Erreur recherche produit :",
                    erreur
                );


                if (
                    sourceProduit
                ) {

                    sourceProduit.textContent =
                        "🌐 Source : Erreur";

                }


                if (
                    poidsRecherche
                ) {

                    poidsRecherche.textContent =
                        "⚖️ Poids réel trouvé : Non disponible";

                }


                if (
                    dimensionsRecherche
                ) {

                    dimensionsRecherche.textContent =
                        "📏 Dimensions trouvées : Non disponibles";

                }


                if (
                    poidsFacturableRecherche
                ) {

                    poidsFacturableRecherche.textContent =
                        "💰 Poids facturable : Non calculable";

                }


                if (
                    etatRechercheProduit
                ) {

                    etatRechercheProduit.textContent =
                        "❌ Impossible d'effectuer la recherche.";

                }

            }

        }
    );

}

// =====================================================
// 🤖 ANALYSE IA DE LA CAPTURE
// =====================================================

document.addEventListener(
    "click",
    async function(event) {

        // Vérifier que le clic vient bien
        // du bouton ANALYSER LA CAPTURE

        if (
            !event.target ||
            event.target.id !== "analyser-capture"
        ) {
            return;
        }


        // ==========================================
        // RÉCUPÉRER LES ÉLÉMENTS
        // ==========================================

        const boutonAnalyse =
            event.target;

        const imageCapture =
            document.getElementById(
                "image-capture-produit"
            );

        const etatRechercheProduit =
            document.getElementById(
                "etat-recherche-produit"
            );

        const rechercheProduit =
            document.getElementById(
                "recherche-produit"
            );


        // ==========================================
        // VÉRIFICATION IMAGE
        // ==========================================

        if (
            !imageCapture ||
            !imageCapture.src
        ) {

            if (etatRechercheProduit) {

                etatRechercheProduit.textContent =
                    "⚠️ Aucune capture à analyser.";

            }

            return;
        }


        // ==========================================
        // ÉTAT DU BOUTON
        // ==========================================

        boutonAnalyse.disabled = true;

        boutonAnalyse.textContent =
            "🤖 ANALYSE IA EN COURS...";


        if (etatRechercheProduit) {

            etatRechercheProduit.textContent =
                "🤖 L'IA analyse visuellement le produit...";

        }


        try {

            // ==========================================
            // ENVOYER L'IMAGE AU WORKER
            // ==========================================

            const response =
                await fetch(
                    URL_WORKER +
                    "analyser-image",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                image:
                                    imageCapture.src
                            })
                    }
                );


            // ==========================================
            // VÉRIFIER RÉPONSE HTTP
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    "Erreur HTTP " +
                    response.status
                );

            }


            // ==========================================
            // RÉCUPÉRER RÉSULTAT
            // ==========================================

            const donnees =
                await response.json();


            console.log(
                "========================================"
            );

            console.log(
                "🤖 RÉSULTAT ANALYSE IA :",
                donnees
            );

            console.log(
                "========================================"
            );


            if (
                !donnees.succes
            ) {

                throw new Error(
                    donnees.message ||
                    "L'analyse IA a échoué."
                );

            }


            // ==========================================
            // EXTRAIRE LA RÉPONSE DE L'IA
            // ==========================================

            let analyse = "";

if (
    donnees.analyse &&
    donnees.analyse.choices &&
    donnees.analyse.choices.length > 0 &&
    donnees.analyse.choices[0].message &&
    typeof donnees.analyse.choices[0].message.content ===
        "string"
) {

    analyse =
        donnees.analyse
            .choices[0]
            .message
            .content;

}
else if (
    donnees.analyse &&
    typeof donnees.analyse.response ===
        "string"
) {

    analyse =
        donnees.analyse.response;

}
else if (
    donnees.analyse &&
    typeof donnees.analyse.result ===
        "string"
) {

    analyse =
        donnees.analyse.result;

}
else if (
    typeof donnees.analyse ===
        "string"
) {

    analyse =
        donnees.analyse;

}
else {

    analyse =
        "";

}

            analyse =
                String(analyse || "")
                    .trim();


            // ==========================================
            // AUCUNE ANALYSE
            // ==========================================

            if (!analyse) {

                if (etatRechercheProduit) {

                    etatRechercheProduit.textContent =
                        "⚠️ L'IA n'a pas pu identifier le produit.";

                }

                return;
            }


            // ==========================================
            // AFFICHER LE RÉSULTAT
            // ==========================================

            if (etatRechercheProduit) {

                etatRechercheProduit.innerHTML =
                    "🤖 <strong>Analyse IA :</strong><br>" +
                    analyse.replace(
                        /\n/g,
                        "<br>"
                    );

            }


            // ==========================================
            // REMPLIR LA RECHERCHE
            // ==========================================
            //
            // IMPORTANT :
            // Pour cette première étape, nous affichons
            // le résultat mais nous NE lançons PAS encore
            // automatiquement la recherche produit.
            //
            // Nous allons d'abord vérifier exactement
            // ce que l'IA retourne sur une vraie capture.
            //
            // ==========================================

           // =====================================================
// 🔎 CONSTRUCTION DE LA RECHERCHE À PARTIR DE L'IA
// =====================================================

if (rechercheProduit) {

    const lignesAnalyse =
        analyse.split("\n");

    const informationsRecherche = [];

    lignesAnalyse.forEach(function(ligne) {

        const partie =
            ligne.split(":");

        if (partie.length < 2) {
            return;
        }

        const champ =
            partie[0]
                .trim()
                .toUpperCase();

        const valeur =
            partie
                .slice(1)
                .join(":")
                .trim();

        if (
            !valeur ||
            valeur === "Non identifié" ||
            valeur === "À RECHERCHER"
        ) {
            return;
        }

        const champsUtiles = [
            "TYPE_PRODUIT",
            "MARQUE",
            "MODELE",
            "REFERENCE",
            "VARIANTE",
            "MOTIF",
            "PERSONNAGES",
            "COULEUR",
            "MATIERE_APPARENTE",
            "TEXTE_VISIBLE",
            "DETAILS_DISTINCTIFS"
        ];

        if (
            champsUtiles.includes(champ)
        ) {
            informationsRecherche.push(
                valeur
            );
        }

    });

    const requeteRecherche =
        informationsRecherche.join(" ");

    rechercheProduit.value =
        requeteRecherche;

    console.log(
        "🔎 REQUÊTE DE RECHERCHE IA :",
        requeteRecherche
    );
}

        }

        catch (erreur) {

            console.error(
                "❌ Erreur analyse IA :",
                erreur
            );


            if (etatRechercheProduit) {

                etatRechercheProduit.textContent =
                    "❌ Impossible d'analyser la capture avec l'IA.";
            }

        }

        finally {

            // ==========================================
            // RÉACTIVER LE BOUTON
            // ==========================================

            boutonAnalyse.disabled =
                false;

            boutonAnalyse.textContent =
                "🤖 ANALYSER LA CAPTURE";

        }

    }
);
