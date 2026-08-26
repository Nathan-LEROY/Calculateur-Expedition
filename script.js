// ==========================================
// CALCULATEUR D'EXPÉDITION
// ==========================================


// ==========================================
// PARAMÈTRES
// ==========================================

const TAUX_YUAN_AR_DEFAUT = 670;


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

const transport = document.getElementById("transport");

const marchandise = document.getElementById("marchandise");

const service = document.getElementById("service");

const blocService = document.getElementById("bloc-service");

const blocPoids = document.getElementById("bloc-poids");

const blocTaux = document.getElementById("bloc-taux");

const hauteur = document.getElementById("hauteur");

const longueur = document.getElementById("longueur");

const largeur = document.getElementById("largeur");

const poids = document.getElementById("poids");

const prixYuan = document.getElementById("prix-yuan");

const tauxYuan = document.getElementById("taux-yuan");

const tauxDollar = document.getElementById("taux-dollar");

const zoneTauxDollar =
    document.getElementById("zone-taux-dollar");

const boutonCalculer = document.getElementById("calculer");

const resultats = document.getElementById("resultats");

const choixEmballage =
    document.getElementById("choix-emballage");

// ==========================================
// AFFICHER / CACHER LES CHAMPS
// ==========================================

function mettreAJourTransport() {

    if (transport.value === "avion") {

        // ✈️ AVION

        blocService.style.display = "block";

        blocPoids.style.display = "block";

        zoneTauxDollar.style.display = "none";

        tauxDollar.value = "";

    } else {

        // 🚢 MARITIME

        blocService.style.display = "none";

        blocPoids.style.display = "none";

        zoneTauxDollar.style.display = "block";

    }

}

// ==========================================
// CALCUL POIDS VOLUMÉTRIQUE DU COLIS
// ==========================================

function calculerPoidsVolumetrique(typeEmballage = "carton") {

    // Dimensions du produit
    const H = parseFloat(hauteur.value) || 0;
    const L = parseFloat(longueur.value) || 0;
    const l = parseFloat(largeur.value) || 0;

    let marge = 0;

    // Marge selon l'emballage détecté automatiquement
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

    // Dimensions extérieures du colis avec emballage
    const hauteurColis = H + (marge * 2);
    const longueurColis = L + (marge * 2);
    const largeurColis = l + (marge * 2);

    // Calcul du poids volumétrique
    return (
        hauteurColis *
        longueurColis *
        largeurColis
    ) / 6000;
}

// ==========================================
// CALCUL POIDS FACTURABLE AVEC EMBALLAGE
// ==========================================

function calculerPoidsFacturable(typeEmballage = "carton") {

    const poidsProduit =
        parseFloat(poids.value) || 0;

    let poidsEmballage = 0;

    // Poids selon l'emballage détecté automatiquement
    switch (typeEmballage) {

        case "petit-sachet":
            poidsEmballage = 0.010;
            break;

        case "sachet":
            poidsEmballage = 0.020;
            break;

        case "enveloppe":
            poidsEmballage = 0.030;
            break;

        case "petit-carton":
            poidsEmballage = 0.050;
            break;

        case "carton":
            poidsEmballage = 0.150;
            break;

        case "grand-carton":
            poidsEmballage = 0.300;
            break;
    }

    // Poids réel total : produit + emballage
    const poidsReelColis =
        poidsProduit + poidsEmballage;

    // Poids volumétrique
    const poidsVolumetrique =
    calculerPoidsVolumetrique(typeEmballage);

    // Le poids facturable est le plus élevé des deux
    return Math.max(
        poidsReelColis,
        poidsVolumetrique
    );
}

// ==========================================
// CALCUL DES DIMENSIONS DE L'EMBALLAGE
// ==========================================

function calculerInformationsEmballage(type) {

    const typeInfo =
        document.getElementById("type-emballage-info");

    const poidsInfo =
        document.getElementById("poids-emballage-info");

    const dimensionsInfo =
        document.getElementById("dimensions-emballage-info");

    const emballageInfo =
        document.getElementById("emballage-recherche");

    if (!type) {

        emballageInfo.textContent =
            "📦 EMBALLAGE : —";

        typeInfo.textContent =
            "🏷️ Type : —";

        poidsInfo.textContent =
            "⚖️ Poids emballage : —";

        dimensionsInfo.textContent =
            "📏 Dimensions emballage : —";

        return;
    }

    const H =
        parseFloat(hauteur.value) || 0;

    const L =
        parseFloat(longueur.value) || 0;

    const l =
        parseFloat(largeur.value) || 0;

    if (H <= 0 || L <= 0 || l <= 0) {

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

    let marge = 0;
    let poidsEmballage = 0;
    let nomEmballage = "";

    switch (type) {

            
        case "petit-sachet":
            marge = 1;
            poidsEmballage = 0.010;
            nomEmballage = "Petit sachet";
            break;

        case "sachet":
            marge = 1.5;
            poidsEmballage = 0.020;
            nomEmballage = "Sachet";
            break;

        case "enveloppe":
            marge = 2;
            poidsEmballage = 0.030;
            nomEmballage = "Enveloppe";
            break;

        case "petit-carton":
            marge = 2;
            poidsEmballage = 0.050;
            nomEmballage = "Petit carton";
            break;

        case "carton":
            marge = 3;
            poidsEmballage = 0.150;
            nomEmballage = "Carton";
            break;

        case "grand-carton":
            marge = 5;
            poidsEmballage = 0.300;
            nomEmballage = "Grand carton";
            break;

        default:
            return;
    }

    const hauteurEmballage =
        H + (marge * 2);

    const longueurEmballage =
        L + (marge * 2);

    const largeurEmballage =
        l + (marge * 2);

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
// CALCUL VOLUME MARITIME
// ==========================================

function calculerVolumeMaritime() {

    const H = parseFloat(hauteur.value) || 0;

    const L = parseFloat(longueur.value) || 0;

    const l = parseFloat(largeur.value) || 0;

    return (H * L * l) / 1000000;

}


// ==========================================
// BOUTON CALCULER
// ==========================================

boutonCalculer.addEventListener(
    "click",
    function() {

        // ==================================
        // VÉRIFICATION DES CHAMPS
        // ==================================

        const H = parseFloat(hauteur.value);
        const L = parseFloat(longueur.value);
        const l = parseFloat(largeur.value);
        const P = parseFloat(poids.value);
        const prix = parseFloat(prixYuan.value);

        // Vérification des dimensions
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
                    ⚠️ <strong>Veuillez renseigner correctement
                    la hauteur, la longueur et la largeur.</strong>
                </p>
            `;

            return;
        }


        // Vérification du poids pour l'AVION
        if (
            transport.value === "avion" &&
            (!P || P <= 0)
        ) {

            resultats.innerHTML = `
                <p>
                    ⚠️ <strong>Veuillez renseigner
                    le poids réel.</strong>
                </p>
            `;

            return;
        }


        // Vérification du prix de la marchandise
        if (
            !prix ||
            prix < 0
        ) {

            resultats.innerHTML = `
                <p>
                    ⚠️ <strong>Veuillez renseigner
                    le prix de la marchandise en Yuan.</strong>
                </p>
            `;

            return;
        }


        // ==================================
        // INFORMATIONS COMMUNES
        // ==================================

        const montantYuan =
            parseFloat(prixYuan.value) || 0;

        const tauxYuanUtilise =
            parseFloat(tauxYuan.value) ||
            TAUX_YUAN_AR_DEFAUT;

        const montantMarchandiseAR =
            montantYuan * tauxYuanUtilise;


        // ==================================
        // ✈️ AVION
        // ==================================

        if (transport.value === "avion") {

            calculerAvion(
                montantYuan,
                montantMarchandiseAR
            );

        }


        // ==================================
        // 🚢 MARITIME
        // ==================================

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


// ==========================================
// CALCUL AVION
// ==========================================

function calculerAvion(
    montantYuan,
    montantMarchandiseAR
) {

    const poidsProduit =
    parseFloat(poids.value) || 0;

// ==========================================
// EMBALLAGE AUTOMATIQUE
// ==========================================

const typeEmballageAuto =
    window.typeEmballageAuto || "carton";

let poidsEmballage = 0;

switch (typeEmballageAuto) {

    case "petit-sachet":
        poidsEmballage = 0.010;
        break;

    case "sachet":
        poidsEmballage = 0.020;
        break;

    case "enveloppe":
        poidsEmballage = 0.030;
        break;

    case "petit-carton":
        poidsEmballage = 0.050;
        break;

    case "carton":
        poidsEmballage = 0.150;
        break;

    case "grand-carton":
        poidsEmballage = 0.300;
        break;
}

const poidsReel =
    poidsProduit + poidsEmballage;

const poidsVolumetrique =
    calculerPoidsVolumetrique(typeEmballageAuto);

const poidsFacturable =
    Math.max(
        poidsReel,
        poidsVolumetrique
    );


    let tarif = 0;

    let nomTarif = "";

    let jourDepart = "";

    let delai = "";

    // ----------------------------------
    // MARCHANDISE GÉNÉRALE
    // ----------------------------------

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

        } else {

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


    // ----------------------------------
    // BATTERIE
    // ----------------------------------

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
           "15 à 15 jours";

    }


    // ----------------------------------
    // POUDRE
    // ----------------------------------

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
        poidsFacturable * tarif;


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
                ${poidsReel.toFixed(2)} kg
            </strong>
        </p>

        <p>
            📦 Poids volumétrique :
            <strong>
                ${poidsVolumetrique.toFixed(2)} kg
            </strong>
        </p>

        <p>
            💰 Poids facturable :
            <strong>
                ${poidsFacturable.toFixed(2)} kg
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

    let jourDepart =
        "Tous les vendredis";

    let delai =
        "45 à 60 jours";


    // ----------------------------------
    // MARCHANDISE GÉNÉRALE
    // ----------------------------------

    if (
        marchandise.value === "general"
    ) {

        tarif =
            TARIFS_MARITIME.general;

        nomTarif =
            "Marchandise générale";

    }


    // ----------------------------------
    // BATTERIE
    // ----------------------------------

    else if (
        marchandise.value === "batterie"
    ) {

        tarif =
            TARIFS_MARITIME.batterie;

        nomTarif =
            "Marchandise avec batterie";

    }


    // ----------------------------------
    // POUDRE
    // ----------------------------------

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


    // ----------------------------------
    // TAUX DOLLAR
    // ----------------------------------

    const tauxDollarUtilise =
        parseFloat(tauxDollar.value) || 0;


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


    // ----------------------------------
    // TRANSPORT EN DOLLARS
    // ----------------------------------

    const fraisDollar =
        volume * tarif;


    // ----------------------------------
    // TRANSPORT EN AR
    // ----------------------------------

    const fraisTransportAR =
        fraisDollar *
        tauxDollarUtilise;


    // ----------------------------------
    // TOTAL
    // ----------------------------------

    const total =
        fraisTransportAR +
        montantMarchandiseAR;


    // ----------------------------------
    // AFFICHAGE
    // ----------------------------------

    resultats.innerHTML = `

        <h3>🚢 TRANSPORT : MARITIME</h3>

        <p>
            📦 Type :
            <strong>
                ${nomTarif}
            </strong>
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
// INITIALISATION
// ==========================================

transport.addEventListener(
    "change",
    mettreAJourTransport
);

mettreAJourTransport();

function reinitialiser() {

// Champs numériques
    document.getElementById("hauteur").value = "";
    document.getElementById("longueur").value = "";
    document.getElementById("largeur").value = "";
    document.getElementById("poids").value = "";
    document.getElementById("prix-yuan").value = "";

    // Taux Yuan : valeur par défaut
    document.getElementById("taux-yuan").value = "670";

    // Taux Dollar : vide
    document.getElementById("taux-dollar").value = "";

    // Effacer le résultat
    const resultats = document.getElementById("resultats");

    if (resultats) {
        resultats.innerHTML = "";
    }

}

// ==========================================
// AJOUTER UN DEVIS
// ==========================================

let numeroDevis = 0;


function ajouterDevis() {

    // Récupérer les éléments
    const nomProduit =
        document.getElementById("nom-produit");

    const resultats =
        document.getElementById("resultats");

    const listeDevis =
        document.getElementById("liste-devis");


    // Vérifier le nom du produit
    if (!nomProduit.value.trim()) {

        alert(
            "⚠️ Veuillez renseigner le nom du produit."
        );

        nomProduit.focus();

        return;
    }


    // Vérifier qu'un calcul existe
    if (
        !resultats ||
        !resultats.innerText.trim()
    ) {

        alert(
            "⚠️ Veuillez d'abord effectuer un calcul."
        );

        return;
    }


    // Numéro du devis
    numeroDevis++;


    // Date du devis
    const maintenant = new Date();

    const dateDevis =
        maintenant.toLocaleDateString("fr-FR");


    // Récupérer le résultat
    // et supprimer Départ / Délai
    const texteResultat =
        resultats.innerText
            .replace(/📅 Départ :[^\n]*/g, "")
            .replace(/⏱️ Délai :[^\n]*/g, "")
            .replace(/\n{2,}/g, "\n")
            .trim();


    // ==========================================
    // PREMIER DEVIS
    // ==========================================

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


    // ==========================================
    // DEVIS SUIVANTS
    // ==========================================

    else {

        listeDevis.innerText +=

`────────────────────────────────
${numeroDevis}) 📦 Nom du produit : ${nomProduit.value.trim()}
${texteResultat}

`;

    }


        // Faire défiler vers le dernier devis
    listeDevis.scrollTop =
        listeDevis.scrollHeight;


    // Sauvegarder les devis dans le navigateur
    localStorage.setItem(
        "devisExpedition",
        listeDevis.innerText
    );

}
// ==========================================
// EFFACER TOUS LES DEVIS
// ==========================================

function effacerDevis() {

    const listeDevis =
        document.getElementById("liste-devis");


    // Vérifier s'il existe des devis
    if (
        !listeDevis ||
        !listeDevis.innerText.trim()
    ) {

        alert(
            "ℹ️ Aucun devis à effacer."
        );

        return;
    }


    // Demander confirmation
    const confirmation =
        confirm(
            "⚠️ Voulez-vous vraiment effacer tous les devis ?"
        );


    if (!confirmation) {

        return;
    }


    // Effacer tous les devis
    listeDevis.innerText = "";


    // Recommencer la numérotation à 1
    numeroDevis = 0;

}

// ==========================================
// COPIER TOUS LES DEVIS
// ==========================================

async function copierDevis() {

    const listeDevis =
        document.getElementById("liste-devis");


    // Vérifier s'il existe des devis
    if (
        !listeDevis ||
        !listeDevis.innerText.trim()
    ) {

        alert(
            "ℹ️ Aucun devis à copier."
        );

        return;
    }


    // Récupérer le texte des devis
    const texteDevis =
        listeDevis.innerText.trim();


    try {

        await navigator.clipboard.writeText(
            texteDevis
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
// IMPRIMER TOUS LES DEVIS
// ==========================================

function imprimerDevis() {

    const listeDevis =
        document.getElementById("liste-devis");


    // Vérifier s'il existe des devis
    if (
        !listeDevis ||
        !listeDevis.innerText.trim()
    ) {

        alert(
            "ℹ️ Aucun devis à imprimer."
        );

        return;
    }


    // Récupérer le contenu des devis
    const contenuDevis =
        listeDevis.innerText.trim();


    // Ouvrir une nouvelle fenêtre
    const fenetreImpression =
        window.open(
            "",
            "_blank",
            "width=800,height=600"
        );


    // Vérifier que la fenêtre a pu être ouverte
    if (!fenetreImpression) {

        alert(
            "⚠️ La fenêtre d'impression a été bloquée par le navigateur."
        );

        return;
    }


    // Construire la page d'impression
    fenetreImpression.document.write(`
<!DOCTYPE html>

<html>

<head>

    <meta charset="UTF-8">

    <title>Devis</title>

    <style>

        body {
            font-family: "Courier New", monospace;
            font-size: 14px;
            line-height: 1;;
            white-space: pre-wrap;
            padding: 30px;
        }

        h1 {
            text-align: center;
            margin-bottom: 20px;
        }

    </style>

</head>

<body>

    <div>${contenuDevis}</div>

</body>

</html>
`);


    // Fermer le document
    fenetreImpression.document.close();


    // Donner le focus
    fenetreImpression.focus();


    // Lancer l'impression
    fenetreImpression.print();

}

// ==========================================
// AFFICHER / MASQUER LE BLOC DEVIS
// ==========================================

function afficherMasquerDevis() {

    const blocDevis =
        document.getElementById("bloc-devis");

    const boutonDevis =
        document.getElementById("btnAfficherDevis");


    if (!blocDevis) {
        return;
    }


    // Vérifier si le bloc est caché
    if (
        blocDevis.style.display === "none"
    ) {

        // Afficher le bloc
        blocDevis.style.display = "block";

        boutonDevis.innerHTML =
            "📄 MASQUER LES DEVIS";


        // Faire défiler jusqu'au bloc
        blocDevis.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

    else {

        // Cacher le bloc
        blocDevis.style.display = "none";

        boutonDevis.innerHTML =
            "📄 DEVIS";

    }

}

// ==========================================
// CHARGER LES DEVIS SAUVEGARDÉS
// ==========================================

window.addEventListener("DOMContentLoaded", function() {

    const listeDevis =
        document.getElementById("liste-devis");


    if (!listeDevis) {
        return;
    }


    // Récupérer les devis sauvegardés
    const devisSauvegardes =
        localStorage.getItem("devisExpedition");


    if (
        devisSauvegardes &&
        devisSauvegardes.trim()
    ) {

        listeDevis.innerText =
            devisSauvegardes;


        // Compter les devis existants
        const correspondances =
            devisSauvegardes.match(
                /^\d+\) 📦 Nom du produit :/gm
            );


        if (correspondances) {

            numeroDevis =
                correspondances.length;

        }

    }

});

// =====================================================
// APERÇU DE LA CAPTURE PRODUIT
// =====================================================

const captureProduit = document.getElementById("capture-produit");
const apercuCapture = document.getElementById("apercu-capture");

if (captureProduit && apercuCapture) {

    captureProduit.addEventListener("change", function () {

        // Vérifie qu'une image a bien été sélectionnée
        if (this.files && this.files[0]) {

            const fichier = this.files[0];

            // Vérifie que le fichier est bien une image
            if (!fichier.type.startsWith("image/")) {
                apercuCapture.innerHTML =
                    "<p>❌ Veuillez sélectionner une image.</p>";
                return;
            }

            // Création de l'aperçu
            const lecteur = new FileReader();

            lecteur.onload = function (e) {

               apercuCapture.innerHTML = `
    <div class="cadre-apercu-capture">

        <p>📸 Capture sélectionnée :</p>

        <img
            src="${e.target.result}"
            alt="Aperçu de la capture du produit"
        >

        <button
            type="button"
            id="supprimer-capture">
            🗑️ SUPPRIMER LA CAPTURE
        </button>

    </div>
`;

const boutonSupprimer = document.getElementById("supprimer-capture");

if (boutonSupprimer) {

    boutonSupprimer.addEventListener("click", function () {

        captureProduit.value = "";
        apercuCapture.innerHTML = "";

    });
}

            };

            lecteur.readAsDataURL(fichier);
        }
    });
}

// =====================================================
// BOUTON RECHERCHER - INFORMATIONS PRODUIT
// =====================================================

const btnRechercheProduit = document.getElementById("btnRechercheProduit");

if (btnRechercheProduit) {

    btnRechercheProduit.addEventListener("click", function () {

        const rechercheProduit = document.getElementById("recherche-produit");
        const sourceProduit = document.getElementById("source-produit");
        const poidsRecherche = document.getElementById("poids-recherche");

const dimensionsRecherche =
    document.getElementById("dimensions-recherche");

const etatRechercheProduit =
    document.getElementById("etat-recherche-produit");

const poidsFacturableRecherche =
    document.getElementById("poids-facturable-recherche");

        const texteRecherche = rechercheProduit.value.trim();

        if (texteRecherche === "") {

            sourceProduit.textContent = "🌐 Source : Aucune recherche";
            poidsRecherche.textContent = "⚖️ Poids réel trouvé : Non disponible";
            dimensionsRecherche.textContent =
    "📏 Dimensions trouvées : Non disponibles";
            poidsFacturableRecherche.textContent = "💰 Poids facturable : Non calculable";

etatRechercheProduit.textContent = "⚠️ Veuillez indiquer un produit ou un lien.";

            return;
        }

        etatRechercheProduit.textContent = "🔎 Recherche en cours...";

fetch(
    "https://calculateur-expedition-api.jjandrianarivony.workers.dev/?produit=" +
    encodeURIComponent(texteRecherche)
)
.then(function (response) {

    if (!response.ok) {
        throw new Error("Erreur HTTP " + response.status);
    }

    return response.json();
})
.then(function (donnees) {

    if (!donnees.succes) {
        throw new Error(
            donnees.message || "Erreur lors de la recherche"
        );
    }

    sourceProduit.textContent =
        "🌐 Source : " +
        (donnees.source || "Non disponible");

    if (donnees.poids_reel !== null) {

    // ==========================================
    // POIDS RÉEL TROUVÉ PAR LA RECHERCHE
    // ==========================================

    const poidsTrouve =
        parseFloat(donnees.poids_reel) || 0;

    poidsRecherche.textContent =
        "⚖️ Poids réel trouvé : " +
        poidsTrouve.toFixed(3) +
        " kg";

    // Injection du poids dans le calculateur
    
        // ==========================================
// POIDS PRODUIT + EMBALLAGE
// ==========================================

poids.value = poidsTrouve;

        // ==========================================
// DÉTECTION AUTOMATIQUE DE L'EMBALLAGE
// ==========================================

window.typeEmballageAuto = "carton";

// Produit recherché
const produitRecherche =
    texteRecherche.toLowerCase();

// Petits produits / accessoires
if (
    produitRecherche.includes("câble") ||
    produitRecherche.includes("cable") ||
    produitRecherche.includes("chargeur") ||
    produitRecherche.includes("écouteur") ||
    produitRecherche.includes("ecouteur") ||
    produitRecherche.includes("coque") ||
    produitRecherche.includes("étui") ||
    produitRecherche.includes("etui") ||
    produitRecherche.includes("adaptateur") ||
    produitRecherche.includes("petit accessoire")
) {

    window.typeEmballageAuto = "petit-sachet";

}

// Produits plats ou fragiles
else if (
    produitRecherche.includes("document") ||
    produitRecherche.includes("livre") ||
    produitRecherche.includes("enveloppe") ||
    produitRecherche.includes("photo")
) {

    window.typeEmballageAuto = "enveloppe";

}

// Produits volumineux
else if (
    produitRecherche.includes("ordinateur") ||
    produitRecherche.includes("pc portable") ||
    produitRecherche.includes("écran") ||
    produitRecherche.includes("ecran") ||
    produitRecherche.includes("télévision") ||
    produitRecherche.includes("television") ||
    produitRecherche.includes("imprimante")
) {

    window.typeEmballageAuto = "grand-carton";

}

// Smartphones et appareils électroniques
else if (
    produitRecherche.includes("iphone") ||
    produitRecherche.includes("smartphone") ||
    produitRecherche.includes("téléphone") ||
    produitRecherche.includes("telephone") ||
    produitRecherche.includes("tablette") ||
    produitRecherche.includes("ipad")
) {

    window.typeEmballageAuto = "carton";
}

// ==========================================
// DIMENSIONS TROUVÉES PAR LA RECHERCHE
// ==========================================

if (
    donnees.dimensions &&
    donnees.dimensions.hauteur_cm !== null &&
    donnees.dimensions.longueur_cm !== null &&
    donnees.dimensions.largeur_cm !== null
) {

    const hauteurTrouvee =
        parseFloat(donnees.dimensions.hauteur_cm);

    const longueurTrouvee =
        parseFloat(donnees.dimensions.longueur_cm);

    const largeurTrouvee =
        parseFloat(donnees.dimensions.largeur_cm);


    // Affichage des dimensions trouvées
    dimensionsRecherche.textContent =
        "📏 Dimensions trouvées : " +
        hauteurTrouvee.toFixed(2) + " × " +
        longueurTrouvee.toFixed(2) + " × " +
        largeurTrouvee.toFixed(2) +
        " cm";


    // Injection des dimensions dans le calculateur
    hauteur.value = hauteurTrouvee;
    longueur.value = longueurTrouvee;
    largeur.value = largeurTrouvee;


    // ==========================================
    // AFFICHER L'EMBALLAGE AUTOMATIQUE
    // ==========================================

    // ==========================================
// CHOIX DE L'EMBALLAGE
// ==========================================

let emballageFinal = typeEmballageAuto;

if (
    choixEmballage &&
    choixEmballage.value !== "auto"
) {

    emballageFinal =
        choixEmballage.value;
}

// Afficher l'emballage choisi
calculerInformationsEmballage(
    emballageFinal
);

} else {

    dimensionsRecherche.textContent =
        "📏 Dimensions trouvées : Non disponibles";
}
      
    // ==========================================
    // CALCUL DU POIDS FACTURABLE
    // ==========================================

   const poidsFacturable =
    calculerPoidsFacturable(emballageFinal);

    poidsFacturableRecherche.textContent =
        "💰 Poids facturable : " +
        poidsFacturable.toFixed(3) +
        " kg";


        etatRechercheProduit.textContent =
        "✅ Recherche effectuée pour : " +
        texteRecherche;

} else {

        poidsRecherche.textContent =
            "⚖️ Poids réel trouvé : Non disponible";

        poidsFacturableRecherche.textContent =
            "💰 Poids facturable : Non calculable";

        etatRechercheProduit.textContent =
            "⚠️ Poids du produit introuvable.";
    }

})
.catch(function (erreur) {

    console.error("Erreur recherche produit :", erreur);

    sourceProduit.textContent =
        "🌐 Source : Erreur";

    poidsRecherche.textContent =
        "⚖️ Poids réel trouvé : Non disponible";

    poidsFacturableRecherche.textContent =
        "💰 Poids facturable : Non calculable";

    etatRechercheProduit.textContent =
        "❌ Impossible d'effectuer la recherche.";
});

fetch(
    "https://calculateur-expedition-api.jjandrianarivony.workers.dev/?produit=" +
    encodeURIComponent(texteRecherche)
)
    .then(function (reponse) {

        if (!reponse.ok) {
            throw new Error("Erreur de connexion avec l'API");
        }

        return reponse.json();
    })
    .then(function (donnees) {

        etatRechercheProduit.textContent =
            "✅ " + donnees.message;

    })
    .catch(function (erreur) {

        console.error(erreur);

        etatRechercheProduit.textContent =
            "❌ Impossible de contacter le service de recherche.";

    });
    });
}
