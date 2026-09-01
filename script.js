// =====================================================
// 📦 CALCULATEUR D'EXPÉDITION
// =====================================================


// =====================================================
// PARAMÈTRES
// =====================================================

const TAUX_YUAN_AR_DEFAUT = 670;


// =====================================================
// URL DU WORKER CLOUDFLARE
// =====================================================

const URL_WORKER =
    "https://calculateur-expedition-api.jjandrianarivony.workers.dev/";


// =====================================================
// TARIFS AVION
// =====================================================

const TARIFS_AVION = {

    general_express: 78800,
    general_normal: 65800,
    batterie: 128000,
    poudre: 88000

};


// =====================================================
// TARIFS MARITIME
// =====================================================

const TARIFS_MARITIME = {

    general: 360,
    batterie: 425

};


// =====================================================
// ÉLÉMENTS HTML
// =====================================================

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


// =====================================================
// VARIABLES GLOBALES
// =====================================================

window.typeEmballageAuto = "carton";

let numeroDevis = 0;


// =====================================================
// AFFICHER / CACHER LES CHAMPS
// =====================================================

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


// =====================================================
// MARGE EMBALLAGE
// =====================================================

function obtenirMargeEmballage(typeEmballage = "carton") {

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


// =====================================================
// POIDS EMBALLAGE
// =====================================================

function obtenirPoidsEmballage(typeEmballage = "carton") {

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


// =====================================================
// POIDS VOLUMÉTRIQUE
// =====================================================

function calculerPoidsVolumetrique(
    typeEmballage = "carton"
) {

    const H =
        parseFloat(hauteur?.value) || 0;

    const L =
        parseFloat(longueur?.value) || 0;

    const l =
        parseFloat(largeur?.value) || 0;


    const marge =
        obtenirMargeEmballage(typeEmballage);


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


// =====================================================
// POIDS FACTURABLE
// =====================================================

function calculerPoidsFacturable(
    typeEmballage = "carton"
) {

    const poidsProduit =
        parseFloat(poids?.value) || 0;

    const poidsEmballage =
        obtenirPoidsEmballage(typeEmballage);

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


// =====================================================
// INFORMATIONS EMBALLAGE
// =====================================================

function calculerInformationsEmballage(type) {

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
        !type ||
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


// =====================================================
// VOLUME MARITIME
// =====================================================

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


// =====================================================
// DÉTECTION AUTOMATIQUE EMBALLAGE
// =====================================================

function detecterEmballageAutomatique(produit) {

    const texte =
        (produit || "").toLowerCase();


    // -----------------------------------------
    // PETITS ACCESSOIRES
    // -----------------------------------------

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


    // -----------------------------------------
    // DOCUMENTS
    // -----------------------------------------

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


    // -----------------------------------------
    // GROS PRODUITS
    // -----------------------------------------

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


    // -----------------------------------------
    // TÉLÉPHONES / TABLETTES
    // -----------------------------------------

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


    // -----------------------------------------
    // CHAUSSURES
    // -----------------------------------------

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


    // -----------------------------------------
    // VÊTEMENTS
    // -----------------------------------------

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


// =====================================================
// EXTRAIRE POIDS DU DIAGNOSTIC WORKER
// =====================================================

function extrairePoidsDiagnostic(diagnostic) {

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
            valeur > 0
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
            a.produitTrouve &&
            !b.produitTrouve
        ) {
            return -1;
        }

        if (
            !a.produitTrouve &&
            b.produitTrouve
        ) {
            return 1;
        }

        return a.numero - b.numero;

    });


    return candidats[0].poids;

}


// =====================================================
// EXTRAIRE SOURCE DU DIAGNOSTIC
// =====================================================

function extraireSourceDiagnostic(diagnostic) {

    if (!Array.isArray(diagnostic)) {
        return null;
    }


    for (const item of diagnostic) {

        if (!item) {
            continue;
        }


        if (
            item.poids_trouve !== null &&
            item.poids_trouve !== undefined &&
            item.url
        ) {

            return item.url;

        }

    }


    return null;

}


// =====================================================
// AFFICHER INFORMATIONS PRODUIT
// =====================================================

function afficherEtatProduit(message) {

    const element =
        document.getElementById(
            "etat-recherche-produit"
        );

    if (element) {
        element.textContent = message;
    }

}


// =====================================================
// 🔎 RECHERCHE PRODUIT PAR TEXTE
// =====================================================

async function rechercherProduit() {

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


    const texteRecherche =
        rechercheProduit
            ? rechercheProduit.value.trim()
            : "";


    // -----------------------------------------
    // AUCUNE RECHERCHE
    // -----------------------------------------

    if (!texteRecherche) {

        afficherEtatProduit(
            "⚠️ Veuillez indiquer un produit ou un lien."
        );

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

        return;

    }


    // -----------------------------------------
    // AFFICHAGE RECHERCHE EN COURS
    // -----------------------------------------

    if (produitRechercheAffiche) {

        produitRechercheAffiche.textContent =
            "📦 Produit recherché : " +
            texteRecherche;

    }


    afficherEtatProduit(
        "🔎 Recherche en cours..."
    );


    if (sourceProduit) {
        sourceProduit.textContent =
            "🌐 Source : Recherche en cours...";
    }


    // -----------------------------------------
    // URL WORKER
    // -----------------------------------------

    const urlAPI =
        URL_WORKER +
        "?produit=" +
        encodeURIComponent(
            texteRecherche
        );


    console.log(
        "========================================"
    );

    console.log(
        "🔎 RECHERCHE PRODUIT :",
        texteRecherche
    );

    console.log(
        "🌐 URL WORKER :",
        urlAPI
    );

    console.log(
        "========================================"
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
            "📥 RÉPONSE WORKER :",
            donnees
        );


        if (!donnees.succes) {

            throw new Error(
                donnees.message ||
                "La recherche n'a pas abouti."
            );

        }


        // -----------------------------------------
        // SOURCE
        // -----------------------------------------

        let sourceFinale =
            donnees.source ||
            extraireSourceDiagnostic(
                donnees.diagnostic
            );


        if (sourceProduit) {

            sourceProduit.textContent =
                "🌐 Source : " +
                (
                    sourceFinale ||
                    "Non disponible"
                );

        }


        // -----------------------------------------
        // PRODUIT
        // -----------------------------------------

        if (produitRechercheAffiche) {

            produitRechercheAffiche.textContent =
                "📦 Produit recherché : " +
                (
                    donnees.produit ||
                    texteRecherche
                );

        }


        // -----------------------------------------
        // MODÈLE
        // -----------------------------------------

        if (modeleAffiche) {

            modeleAffiche.textContent =
                "🏷️ Modèle : " +
                (
                    donnees.modele ||
                    "—"
                );

        }


        // -----------------------------------------
        // POIDS
        // -----------------------------------------

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

                poidsTrouve =
                    valeur;

            }

        }


        if (poidsTrouve === null) {

            poidsTrouve =
                extrairePoidsDiagnostic(
                    donnees.diagnostic
                );

        }


        if (poidsTrouve !== null) {

            if (poidsRecherche) {

                poidsRecherche.textContent =
                    "⚖️ Poids réel trouvé : " +
                    poidsTrouve.toFixed(3) +
                    " kg";

            }


            if (poids) {
                poids.value =
                    poidsTrouve;
            }

        } else {

            if (poidsRecherche) {

                poidsRecherche.textContent =
                    "⚖️ Poids réel trouvé : Non disponible";

            }

        }


        // -----------------------------------------
        // DIMENSIONS
        // -----------------------------------------

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


                if (dimensionsRecherche) {

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


        // -----------------------------------------
        // EMBALLAGE AUTOMATIQUE
        // -----------------------------------------

        const typeDetecte =
            detecterEmballageAutomatique(
                texteRecherche
            );


        let emballageFinal =
            typeDetecte;


        // Si l'utilisateur a choisi manuellement
        // un emballage différent de "auto",
        // on respecte son choix.

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


        // -----------------------------------------
        // AFFICHER EMBALLAGE
        // -----------------------------------------

        calculerInformationsEmballage(
            emballageFinal
        );


        // -----------------------------------------
        // POIDS FACTURABLE
        // -----------------------------------------

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


            if (poidsFacturableRecherche) {

                poidsFacturableRecherche.textContent =
                    "💰 Poids facturable : " +
                    poidsFacturable.toFixed(3) +
                    " kg";

            }

        } else {

            if (poidsFacturableRecherche) {

                poidsFacturableRecherche.textContent =
                    "💰 Poids facturable : Non calculable";

            }

        }


        // -----------------------------------------
        // STATUT
        // -----------------------------------------

        if (statutAffiche) {

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


        // -----------------------------------------
        // ÉTAT FINAL
        // -----------------------------------------

        if (poidsTrouve !== null) {

            afficherEtatProduit(
                "✅ Recherche effectuée pour : " +
                texteRecherche
            );

        } else {

            afficherEtatProduit(
                "⚠️ Produit trouvé, mais poids non disponible."
            );

        }


        console.log(
            "⚖️ POIDS FINAL :",
            poidsTrouve
        );

        console.log(
            "📦 EMBALLAGE FINAL :",
            emballageFinal
        );

        console.log(
            "🌐 SOURCE FINALE :",
            sourceFinale
        );


    }
    catch (erreur) {

        console.error(
            "❌ ERREUR RECHERCHE PRODUIT :",
            erreur
        );


        if (sourceProduit) {

            sourceProduit.textContent =
                "🌐 Source : Erreur";

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


        afficherEtatProduit(
            "❌ Impossible d'effectuer la recherche."
        );

    }

}


// =====================================================
// 🔎 BOUTON RECHERCHER
// =====================================================

const btnRechercheProduit =
    document.getElementById(
        "btnRechercheProduit"
    );


if (btnRechercheProduit) {

    btnRechercheProduit.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            rechercherProduit();

        }
    );

}


// =====================================================
// 📷 CAPTURE PRODUIT
// =====================================================
// Cette partie fait uniquement :
// - sélection de l'image
// - aperçu
// - suppression
// - préparation pour une future analyse
//
// Elle ne fait PAS encore d'OCR.
// =====================================================

const inputCaptureProduit =
    document.getElementById(
        "capture-produit"
    );

const zoneApercuCapture =
    document.getElementById(
        "apercu-capture"
    );


let captureProduitSelectionnee =
    null;


if (
    inputCaptureProduit &&
    zoneApercuCapture
) {

    inputCaptureProduit.addEventListener(
        "change",
        function() {

            const fichier =
                this.files &&
                this.files[0];


            if (!fichier) {

                return;

            }


            // -----------------------------------------
            // VÉRIFICATION IMAGE
            // -----------------------------------------

            if (
                !fichier.type ||
                !fichier.type.startsWith(
                    "image/"
                )
            ) {

                zoneApercuCapture.innerHTML =
                    "<p>❌ Veuillez sélectionner une image.</p>";

                this.value = "";

                captureProduitSelectionnee =
                    null;

                return;

            }


            // -----------------------------------------
            // MÉMORISATION POUR FUTURE ANALYSE
            // -----------------------------------------

            captureProduitSelectionnee =
                fichier;


            // -----------------------------------------
            // LECTURE IMAGE
            // -----------------------------------------

            const lecteur =
                new FileReader();


            lecteur.onload =
                function(event) {

                    zoneApercuCapture.innerHTML = `

                        <div class="cadre-apercu-capture">

                            <p>
                                📸 Capture sélectionnée :
                            </p>

                            <img
                                src="${event.target.result}"
                                alt="Aperçu de la capture du produit"
                                style="
                                    max-width:100%;
                                    height:auto;
                                    display:block;
                                    margin:10px auto;
                                    border-radius:10px;
                                "
                            >

                            <button
                                type="button"
                                id="supprimer-capture">

                                🗑️ SUPPRIMER LA CAPTURE

                            </button>

                        </div>

                    `;


                    // -----------------------------------------
                    // BOUTON SUPPRIMER
                    // -----------------------------------------

                    const boutonSupprimer =
                        document.getElementById(
                            "supprimer-capture"
                        );


                    if (boutonSupprimer) {

                        boutonSupprimer.addEventListener(
                            "click",
                            function() {

                                inputCaptureProduit.value =
                                    "";

                                zoneApercuCapture.innerHTML =
                                    "";

                                captureProduitSelectionnee =
                                    null;

                                afficherEtatProduit(
                                    "ℹ️ Capture supprimée."
                                );

                            }
                        );

                    }


                    // -----------------------------------------
                    // ÉTAT
                    // -----------------------------------------

                    afficherEtatProduit(
                        "📷 Capture ajoutée. Analyse de capture prête pour l'étape suivante."
                    );


                    console.log(
                        "📷 CAPTURE PRODUIT PRÊTE POUR ANALYSE :",
                        fichier.name
                    );

                };


            lecteur.onerror =
                function() {

                    zoneApercuCapture.innerHTML =
                        "<p>❌ Impossible de lire l'image.</p>";

                    captureProduitSelectionnee =
                        null;

                };


            lecteur.readAsDataURL(
                fichier
            );

        }
    );

}


// =====================================================
// 🔬 PRÉPARATION FUTURE DE L'ANALYSE DE CAPTURE
// =====================================================
// Cette fonction sera utilisée plus tard pour :
//
// Capture
// ↓
// lecture du texte
// ↓
// nom du produit
// ↓
// modèle
// ↓
// pointure
// ↓
// recherche Worker
//
// Pour l'instant elle ne lance aucune analyse.
// =====================================================

async function analyserCaptureProduit() {

    if (
        !captureProduitSelectionnee
    ) {

        afficherEtatProduit(
            "⚠️ Aucune capture sélectionnée."
        );

        return null;

    }


    console.log(
        "🔬 Analyse de capture prête :",
        captureProduitSelectionnee.name
    );


    return {

        fichier:
            captureProduitSelectionnee,

        nom:
            null,

        modele:
            null,

        pointure:
            null,

        texte:
            null

    };

}


// =====================================================
// 📦 CHANGEMENT MANUEL EMBALLAGE
// =====================================================

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


// =====================================================
// ✈️ CALCUL AVION
// =====================================================

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


    if (!resultats) {
        return;
    }


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


// =====================================================
// 🚢 CALCUL MARITIME
// =====================================================

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


// =====================================================
// 🧮 BOUTON CALCULER
// =====================================================

if (boutonCalculer) {

    boutonCalculer.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


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


            // -----------------------------------------
            // DIMENSIONS
            // -----------------------------------------

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


            // -----------------------------------------
            // POIDS AVION
            // -----------------------------------------

            if (
                transport &&
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


            // -----------------------------------------
            // PRIX
            // -----------------------------------------

            if (
                !Number.isFinite(prix) ||
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
                    prixYuan?.value
                ) || 0;


            const tauxYuanUtilise =
                parseFloat(
                    tauxYuan?.value
                ) ||
                TAUX_YUAN_AR_DEFAUT;


            const montantMarchandiseAR =
                montantYuan *
                tauxYuanUtilise;


            if (
                transport &&
                transport.value === "avion"
            ) {

                calculerAvion(
                    montantYuan,
                    montantMarchandiseAR
                );

            }


            else if (
                transport &&
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


// =====================================================
// 📄 AJOUTER DEVIS
// =====================================================

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


    const nouveauDevis = `

${numeroDevis}) 📦 Nom du produit :
${nomProduit.value.trim()}

${texteResultat}

`;


    if (
        numeroDevis === 1
    ) {

        listeDevis.innerText =
            "════════════════════════════════\n" +
            "       DEVIS EXPÉDITION\n" +
            "════════════════════════════════\n\n" +
            "Date : " +
            dateDevis +
            "\n" +
            nouveauDevis;

    } else {

        listeDevis.innerText +=
            "\n────────────────────────────────\n" +
            nouveauDevis;

    }


    listeDevis.scrollTop =
        listeDevis.scrollHeight;


    localStorage.setItem(
        "devisExpedition",
        listeDevis.innerText
    );

}


// =====================================================
// 🗑️ EFFACER DEVIS
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


    listeDevis.innerText =
        "";

    numeroDevis =
        0;


    localStorage.removeItem(
        "devisExpedition"
    );

}


// =====================================================
// 📋 COPIER DEVIS
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

        console.error(
            erreur
        );

        alert(
            "⚠️ Impossible de copier les devis."
        );

    }

}


// =====================================================
// 🖨️ IMPRIMER DEVIS
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

        <html lang="fr">

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


// =====================================================
// 📄 AFFICHER / MASQUER DEVIS
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


// =====================================================
// 🔄 RÉINITIALISER
// =====================================================

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
        tauxYuan.value =
            TAUX_YUAN_AR_DEFAUT;
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


    captureProduitSelectionnee =
        null;


    const elementsInformations = [

        "source-produit",
        "poids-recherche",
        "dimensions-recherche",
        "poids-facturable-recherche",
        "produit-recherche-info",
        "modele-recherche-info",
        "statut-recherche-info"

    ];


    elementsInformations.forEach(
        function(id) {

            const element =
                document.getElementById(id);

            if (element) {

                element.textContent =
                    "—";

            }

        }
    );


    afficherEtatProduit(
        ""
    );

}


// =====================================================
// 💾 CHARGER LES DEVIS SAUVEGARDÉS
// =====================================================

window.addEventListener(
    "DOMContentLoaded",
    function() {

        const listeDevis =
            document.getElementById(
                "liste-devis"
            );


        if (listeDevis) {

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


        // -----------------------------------------
        // INITIALISATION TRANSPORT
        // -----------------------------------------

        mettreAJourTransport();

    }
);


// =====================================================
// FIN DU SCRIPT
// =====================================================

console.log(
    "✅ script.js chargé correctement."
);

console.log(
    "🔎 Recherche texte : ACTIVE"
);

console.log(
    "📷 Capture produit : ACTIVE"
);

console.log(
    "🔬 Préparation analyse capture : ACTIVE"
);
```
