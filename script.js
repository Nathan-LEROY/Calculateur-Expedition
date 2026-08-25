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
// CALCUL POIDS VOLUMÉTRIQUE AVION
// ==========================================

function calculerPoidsVolumetrique() {

    const H = parseFloat(hauteur.value) || 0;

    const L = parseFloat(longueur.value) || 0;

    const l = parseFloat(largeur.value) || 0;

    return (H * L * l) / 6000;

}


// ==========================================
// CALCUL POIDS FACTURABLE
// ==========================================

function calculerPoidsFacturable() {

    const poidsReel =
        parseFloat(poids.value) || 0;

    const poidsVolumetrique =
        calculerPoidsVolumetrique();

    return Math.max(
        poidsReel,
        poidsVolumetrique
    );

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


    const poidsReel =
        parseFloat(poids.value) || 0;

    const poidsVolumetrique =
        calculerPoidsVolumetrique();

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
        const etatRechercheProduit = document.getElementById("etat-recherche-produit");
        const poidsFacturableRecherche = document.getElementById("poids-facturable-recherche");

        const texteRecherche = rechercheProduit.value.trim();

        if (texteRecherche === "") {

            sourceProduit.textContent = "🌐 Source : Aucune recherche";
            poidsRecherche.textContent = "⚖️ Poids réel trouvé : Non disponible";
            poidsFacturableRecherche.textContent = "💰 Poids facturable : Non calculable";

etatRechercheProduit.textContent = "⚠️ Veuillez indiquer un produit ou un lien.";

            return;
        }

        // Pour l'instant, nous affichons simplement
        // ce qui a été recherché.
        sourceProduit.textContent = "🌐 Recherche : " + texteRecherche;
        poidsRecherche.textContent = "⚖️ Poids réel trouvé : En attente";
        poidsFacturableRecherche.textContent = "💰 Poids facturable : En attente";
        etatRechercheProduit.textContent = "🔎 Recherche en cours...";

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
