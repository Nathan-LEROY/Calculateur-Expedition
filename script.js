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

const blocTaux =
    document.getElementById("bloc-taux");

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

    }


    const hauteurColis =
        H + (marge * 2);

    const longueurColis =
        L + (marge * 2);

    const largeurColis =
        l + (marge * 2);


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
    typeEmballage
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


    if (!type) {

        if (emballageInfo)
            emballageInfo.textContent =
                "📦 EMBALLAGE : —";

        if (typeInfo)
            typeInfo.textContent =
                "🏷️ Type : —";

        if (poidsInfo)
            poidsInfo.textContent =
                "⚖️ Poids emballage : —";

        if (dimensionsInfo)
            dimensionsInfo.textContent =
                "📏 Dimensions emballage : —";

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

        if (emballageInfo)
            emballageInfo.textContent =
                "📦 EMBALLAGE : —";

        if (typeInfo)
            typeInfo.textContent =
                "🏷️ Type : Dimensions du produit nécessaires";

        if (poidsInfo)
            poidsInfo.textContent =
                "⚖️ Poids emballage : —";

        if (dimensionsInfo)
            dimensionsInfo.textContent =
                "📏 Dimensions emballage : —";

        return;

    }


    let marge = 0;

    let nomEmballage = "";


    switch (type) {

        case "petit-sachet":

            marge = 1;
            nomEmballage = "Petit sachet";

            break;


        case "sachet":

            marge = 1.5;
            nomEmballage = "Sachet";

            break;


        case "enveloppe":

            marge = 2;
            nomEmballage = "Enveloppe";

            break;


        case "petit-carton":

            marge = 2;
            nomEmballage = "Petit carton";

            break;


        case "carton":

            marge = 3;
            nomEmballage = "Carton";

            break;


        case "grand-carton":

            marge = 5;
            nomEmballage = "Grand carton";

            break;


        default:

            return;

    }


    const poidsEmballage =
        obtenirPoidsEmballage(type);


    const hauteurEmballage =
        H + marge * 2;

    const longueurEmballage =
        L + marge * 2;

    const largeurEmballage =
        l + marge * 2;


    if (emballageInfo)
        emballageInfo.textContent =
            "📦 EMBALLAGE : " +
            nomEmballage;


    if (typeInfo)
        typeInfo.textContent =
            "🏷️ Type : " +
            nomEmballage;


    if (poidsInfo)
        poidsInfo.textContent =
            "⚖️ Poids emballage : " +
            poidsEmballage.toFixed(3) +
            " kg";


    if (dimensionsInfo)
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
        H * L * l
    ) / 1000000;

}


// ==========================================
// BOUTON CALCULER
// ==========================================

if (boutonCalculer) {

    boutonCalculer.addEventListener(
        "click",
        function () {

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
                !prix ||
                prix < 0
            ) {

                resultats.innerHTML = `
                    <p>
                        ⚠️ <strong>
                        Veuillez renseigner le prix
                        de la marchandise en Yuan.
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

        <h3>✈️ TRANSPORT : AVION</h3>

        <p>
            📦 Type :
            <strong>
                ${nomTarif}
            </strong>
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
// INITIALISATION
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
        function () {

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


            const zone =
                document.getElementById(
                    "poids-facturable-recherche"
                );


            if (zone) {

                zone.textContent =
                    "💰 Poids facturable : " +
                    poidsFacturable.toFixed(3) +
                    " kg";

            }

        }
    );

}


// =====================================================
// RÉINITIALISER
// =====================================================

function reinitialiser() {

    if (hauteur)
        hauteur.value = "";

    if (longueur)
        longueur.value = "";

    if (largeur)
        largeur.value = "";

    if (poids)
        poids.value = "";

    if (prixYuan)
        prixYuan.value = "";

    if (tauxYuan)
        tauxYuan.value = "670";

    if (tauxDollar)
        tauxDollar.value = "";


    window.typeEmballageAuto =
        "carton";


    if (resultats)
        resultats.innerHTML = "";


    const recherche =
        document.getElementById(
            "recherche-produit"
        );

    if (recherche)
        recherche.value = "";


    const apercu =
        document.getElementById(
            "apercu-capture"
        );

    if (apercu)
        apercu.innerHTML = "";

}


// =====================================================
// AJOUTER UN DEVIS
// =====================================================

let numeroDevis = 0;


function ajouterDevis() {

    const nomProduit =
        document.getElementById(
            "nom-produit"
        );

    const resultat =
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

        if (nomProduit)
            nomProduit.focus();

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


    numeroDevis++;


    const maintenant =
        new Date();


    const dateDevis =
        maintenant.toLocaleDateString(
            "fr-FR"
        );


    const texteResultat =
        resultat.innerText

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


// =====================================================
// EFFACER DEVIS
// =====================================================

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


// =====================================================
// COPIER DEVIS
// =====================================================

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


// =====================================================
// IMPRIMER DEVIS
// =====================================================

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


    const contenu =
        listeDevis.innerText.trim();


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

    font-size: 14px;

    line-height: 1.3;

    white-space: pre-wrap;

    padding: 30px;

}

</style>

</head>

<body>

<div>${contenu}</div>

</body>

</html>

`);


    fenetre.document.close();

    fenetre.focus();

    fenetre.print();

}


// =====================================================
// AFFICHER / MASQUER DEVIS
// =====================================================

function afficherMasquerDevis() {

    const blocDevis =
        document.getElementById(
            "bloc-devis"
        );

    const boutonDevis =
        document.getElementById(
            "btnAfficherDevis"
        );


    if (!blocDevis)
        return;


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


// =====================================================
// CHARGER DEVIS
// =====================================================

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const listeDevis =
            document.getElementById(
                "liste-devis"
            );


        if (!listeDevis)
            return;


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


// =====================================================
// CAPTURE PRODUIT
// =====================================================

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
        function () {

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
                function (e) {

                    apercuCapture.innerHTML = `

<div class="cadre-apercu-capture">

<p>
📸 Capture sélectionnée :
</p>

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


                    const boutonSupprimer =
                        document.getElementById(
                            "supprimer-capture"
                        );


                    if (
                        boutonSupprimer
                    ) {

                        boutonSupprimer.addEventListener(
                            "click",
                            function () {

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


// =====================================================
// 🔎 RECHERCHE PRODUIT
// =====================================================

const btnRechercheProduit =
    document.getElementById(
        "btnRechercheProduit"
    );


if (
    btnRechercheProduit
) {

    btnRechercheProduit.addEventListener(
        "click",
        async function () {


            // =================================================
            // ÉLÉMENTS
            // =================================================

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


            const pointureDemandeeAffichee =
                document.getElementById(
                    "pointure-demandee-info"
                );


            const pointureConfirmeeAffichee =
                document.getElementById(
                    "pointure-confirmee-info"
                );


            const referenceAffichee =
                document.getElementById(
                    "reference-produit-info"
                );


            const modeleAffiche =
                document.getElementById(
                    "modele-produit-info"
                );


            const statutAffiche =
                document.getElementById(
                    "statut-produit-info"
                );


            // =================================================
            // TEXTE
            // =================================================

            const texteRecherche =
                rechercheProduit
                    ? rechercheProduit.value.trim()
                    : "";


            // =================================================
            // VALIDATION
            // =================================================

            if (
                texteRecherche === ""
            ) {

                if (sourceProduit)
                    sourceProduit.textContent =
                        "🌐 Source : Aucune recherche";


                if (poidsRecherche)
                    poidsRecherche.textContent =
                        "⚖️ Poids réel trouvé : Non disponible";


                if (dimensionsRecherche)
                    dimensionsRecherche.textContent =
                        "📏 Dimensions trouvées : Non disponibles";


                if (poidsFacturableRecherche)
                    poidsFacturableRecherche.textContent =
                        "💰 Poids facturable : Non calculable";


                if (produitRechercheAffiche)
                    produitRechercheAffiche.textContent =
                        "📦 Produit recherché : —";


                if (pointureDemandeeAffichee)
                    pointureDemandeeAffichee.textContent =
                        "👟 Pointure demandée : —";


                if (pointureConfirmeeAffichee)
                    pointureConfirmeeAffichee.textContent =
                        "🔎 Pointure confirmée : —";


                if (referenceAffichee)
                    referenceAffichee.textContent =
                        "🔖 Référence : —";


                if (modeleAffiche)
                    modeleAffiche.textContent =
                        "🏷️ Modèle : —";


                if (statutAffiche)
                    statutAffiche.textContent =
                        "ℹ️ Statut : —";


                if (etatRechercheProduit)
                    etatRechercheProduit.textContent =
                        "⚠️ Veuillez indiquer un produit ou un lien.";


                return;

            }


            // =================================================
            // DÉTECTION POINTURE
            // =================================================

            let pointureRecherchee =
                null;


            const correspondancePointure =
                texteRecherche.match(
                    /\b(2[4-9]|3[0-9]|4[0-3])\s*(?:FR|EU)\b/i
                );


            if (
                correspondancePointure
            ) {

                pointureRecherchee =
                    parseInt(
                        correspondancePointure[1],
                        10
                    );

            }


            // =================================================
            // PRODUIT SANS POINTURE
            // =================================================

            let rechercheAPI =
                texteRecherche;


            if (
                pointureRecherchee !== null
            ) {

                rechercheAPI =
                    texteRecherche

                        .replace(
                            /\b(2[4-9]|3[0-9]|4[0-3])\s*(?:FR|EU)\b/i,
                            ""
                        )

                        .replace(
                            /\s{2,}/g,
                            " "
                        )

                        .trim();

            }


            // =================================================
            // AFFICHAGE IMMÉDIAT
            // =================================================

            if (produitRechercheAffiche) {

                produitRechercheAffiche.textContent =
                    "📦 Produit recherché : " +
                    rechercheAPI;

            }


            if (pointureDemandeeAffichee) {

                pointureDemandeeAffichee.textContent =
                    "👟 Pointure demandée : " +
                    (
                        pointureRecherchee !== null
                            ? pointureRecherchee + " FR"
                            : "—"
                    );

            }


            if (etatRechercheProduit) {

                etatRechercheProduit.textContent =
                    "🔎 Recherche en cours...";

            }


            // =================================================
            // URL WORKER
            // =================================================

            let urlAPI =
                "https://calculateur-expedition-api.jjandrianarivony.workers.dev/" +
                "?produit=" +
                encodeURIComponent(
                    rechercheAPI
                );


            if (
                pointureRecherchee !== null
            ) {

                urlAPI +=
                    "&pointure=" +
                    encodeURIComponent(
                        pointureRecherchee +
                        " FR"
                    );

            }


            // =================================================
            // DEBUG
            // =================================================

            console.log(
                "========================================"
            );

            console.log(
                "RECHERCHE ORIGINALE :",
                texteRecherche
            );

            console.log(
                "PRODUIT ENVOYÉ :",
                rechercheAPI
            );

            console.log(
                "POINTURE ENVOYÉE :",
                pointureRecherchee !== null
                    ? pointureRecherchee + " FR"
                    : "AUCUNE"
            );

            console.log(
                "URL WORKER :",
                urlAPI
            );

            console.log(
                "========================================"
            );


            // =================================================
            // APPEL WORKER
            // =================================================

            try {

                const response =
                    await fetch(
                        urlAPI,
                        {
                            method: "GET",
                            cache: "no-store"
                        }
                    );


                console.log(
                    "STATUT HTTP :",
                    response.status
                );


                if (
                    !response.ok
                ) {

                    throw new Error(
                        "Erreur HTTP " +
                        response.status
                    );

                }


                const texteJSON =
                    await response.text();


                console.log(
                    "RÉPONSE BRUTE WORKER :",
                    texteJSON
                );


                let donnees;


                try {

                    donnees =
                        JSON.parse(
                            texteJSON
                        );

                }

                catch (erreurJSON) {

                    throw new Error(
                        "La réponse du Worker n'est pas un JSON valide."
                    );

                }


                console.log(
                    "RÉPONSE WORKER :",
                    donnees
                );


                // =================================================
                // ERREUR WORKER
                // =================================================

                if (
                    donnees.succes === false
                ) {

                    throw new Error(
                        donnees.message ||
                        "Erreur de recherche"
                    );

                }


                // =================================================
                // SOURCE
                // =================================================

                if (sourceProduit) {

                    sourceProduit.textContent =
                        "🌐 Source : " +
                        (
                            donnees.source ||
                            "Non disponible"
                        );

                }


                // =================================================
                // PRODUIT
                // =================================================

                if (
                    produitRechercheAffiche
                ) {

                    produitRechercheAffiche.textContent =
                        "📦 Produit recherché : " +
                        (
                            donnees.produit ||
                            rechercheAPI
                        );

                }


                // =================================================
                // POINTURE DEMANDÉE
                // =================================================

                if (
                    pointureDemandeeAffichee
                ) {

                    pointureDemandeeAffichee.textContent =
                        "👟 Pointure demandée : " +
                        (
                            donnees.pointure ||
                            (
                                pointureRecherchee !== null
                                    ? pointureRecherchee + " FR"
                                    : "—"
                            )
                        );

                }


                // =================================================
                // POINTURE CONFIRMÉE
                // =================================================

                if (
                    pointureConfirmeeAffichee
                ) {

                    pointureConfirmeeAffichee.textContent =
                        "🔎 Pointure confirmée : " +
                        (
                            donnees.pointure_confirmee ||
                            "—"
                        );

                }


                // =================================================
                // RÉFÉRENCE
                // =================================================

                if (
                    referenceAffichee
                ) {

                    referenceAffichee.textContent =
                        "🔖 Référence : " +
                        (
                            donnees.reference ||
                            "—"
                        );

                }


                // =================================================
                // MODÈLE
                // =================================================

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


                // =================================================
                // STATUT
                // =================================================

                if (
                    statutAffiche
                ) {

                    statutAffiche.textContent =
                        "ℹ️ Statut : " +
                        (
                            donnees.statut ||
                            "—"
                        );

                }


                // =================================================
                // POIDS
                // =================================================

                if (
                    donnees.poids_reel !== null &&
                    donnees.poids_reel !== undefined &&
                    !isNaN(
                        parseFloat(
                            donnees.poids_reel
                        )
                    )
                ) {


                    const poidsTrouve =
                        parseFloat(
                            donnees.poids_reel
                        );


                    // -----------------------------------------
                    // AFFICHER LE POIDS
                    // -----------------------------------------

                    if (poidsRecherche) {

                        poidsRecherche.textContent =
                            "⚖️ Poids réel trouvé : " +
                            poidsTrouve.toFixed(3) +
                            " kg";

                    }


                    // -----------------------------------------
                    // INJECTER DANS CALCULATEUR
                    // -----------------------------------------

                    if (poids) {

                        poids.value =
                            poidsTrouve;

                    }


                    // -----------------------------------------
                    // DÉTECTION EMBALLAGE
                    // -----------------------------------------

                    window.typeEmballageAuto =
                        "carton";


                    const produitRecherche =
                        rechercheAPI
                            .toLowerCase();


                    if (
                        produitRecherche.includes("câble") ||
                        produitRecherche.includes("cable") ||
                        produitRecherche.includes("chargeur") ||
                        produitRecherche.includes("écouteur") ||
                        produitRecherche.includes("ecouteur") ||
                        produitRecherche.includes("coque") ||
                        produitRecherche.includes("étui") ||
                        produitRecherche.includes("etui") ||
                        produitRecherche.includes("adaptateur")
                    ) {

                        window.typeEmballageAuto =
                            "petit-sachet";

                    }


                    else if (
                        produitRecherche.includes("document") ||
                        produitRecherche.includes("livre") ||
                        produitRecherche.includes("enveloppe") ||
                        produitRecherche.includes("photo")
                    ) {

                        window.typeEmballageAuto =
                            "enveloppe";

                    }


                    else if (
                        produitRecherche.includes("ordinateur") ||
                        produitRecherche.includes("pc portable") ||
                        produitRecherche.includes("écran") ||
                        produitRecherche.includes("ecran") ||
                        produitRecherche.includes("télévision") ||
                        produitRecherche.includes("television") ||
                        produitRecherche.includes("imprimante")
                    ) {

                        window.typeEmballageAuto =
                            "grand-carton";

                    }


                    else if (
                        produitRecherche.includes("iphone") ||
                        produitRecherche.includes("smartphone") ||
                        produitRecherche.includes("téléphone") ||
                        produitRecherche.includes("telephone") ||
                        produitRecherche.includes("tablette") ||
                        produitRecherche.includes("ipad")
                    ) {

                        window.typeEmballageAuto =
                            "carton";

                    }


                    // -----------------------------------------
                    // DIMENSIONS
                    // -----------------------------------------

                    if (
                        donnees.dimensions &&
                        donnees.dimensions.hauteur_cm !== null &&
                        donnees.dimensions.longueur_cm !== null &&
                        donnees.dimensions.largeur_cm !== null
                    ) {

                        const hauteurTrouvee =
                            parseFloat(
                                donnees.dimensions.hauteur_cm
                            );

                        const longueurTrouvee =
                            parseFloat(
                                donnees.dimensions.longueur_cm
                            );

                        const largeurTrouvee =
                            parseFloat(
                                donnees.dimensions.largeur_cm
                            );


                        if (
                            dimensionsRecherche
                        ) {

                            dimensionsRecherche.textContent =
                                "📏 Dimensions trouvées : " +
                                hauteurTrouvee.toFixed(2) +
                                " × " +
                                longueurTrouvee.toFixed(2) +
                                " × " +
                                largeurTrouvee.toFixed(2) +
                                " cm";

                        }


                        if (hauteur)
                            hauteur.value =
                                hauteurTrouvee;


                        if (longueur)
                            longueur.value =
                                longueurTrouvee;


                        if (largeur)
                            largeur.value =
                                largeurTrouvee;

                    }

                    else {

                        if (
                            dimensionsRecherche
                        ) {

                            dimensionsRecherche.textContent =
                                "📏 Dimensions trouvées : Non disponibles";

                        }

                    }


                    // -----------------------------------------
                    // EMBALLAGE
                    // -----------------------------------------

                    let emballageFinal =
                        choixEmballage
                            ? choixEmballage.value
                            : "auto";


                    if (
                        emballageFinal === "auto"
                    ) {

                        emballageFinal =
                            window.typeEmballageAuto ||
                            "carton";

                    }


                    window.typeEmballageAuto =
                        emballageFinal;


                    calculerInformationsEmballage(
                        emballageFinal
                    );


                    // -----------------------------------------
                    // POIDS FACTURABLE
                    // -----------------------------------------

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


                    // -----------------------------------------
                    // MESSAGE FINAL
                    // -----------------------------------------

                    if (
                        etatRechercheProduit
                    ) {

                        etatRechercheProduit.textContent =
                            "✅ Recherche effectuée pour : " +
                            texteRecherche;

                    }

                }


                // =================================================
                // PAS DE POIDS
                // =================================================

                else {

                    if (poidsRecherche)
                        poidsRecherche.textContent =
                            "⚖️ Poids réel trouvé : Non disponible";


                    if (dimensionsRecherche)
                        dimensionsRecherche.textContent =
                            "📏 Dimensions trouvées : Non disponibles";


                    if (poidsFacturableRecherche)
                        poidsFacturableRecherche.textContent =
                            "💰 Poids facturable : Non calculable";


                    if (
                        etatRechercheProduit
                    ) {

                        etatRechercheProduit.textContent =
                            "⚠️ Poids du produit introuvable.";

                    }

                }


            }

            catch (erreur) {

                console.error(
                    "========================================"
                );

                console.error(
                    "ERREUR RECHERCHE PRODUIT :",
                    erreur
                );

                console.error(
                    "========================================"
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
