const Carton = require("../Carton.model");

/**
 * Populate the database with dummy carton objects.
 */
async function populate() {
  // Insertion du carton ordinateur
  const ordinateur = {
    user: "exemple",
    parent: undefined,
    nom: "Ordinateur",
    private: false,
    versions: [
      {
        nom: "Basique",
        quoi: {
          texte: "Un outil humain",
        },
        fonction: {
          texte: "Fait des calculs",
        },
        comment: {
          texte: "Avec des transistors et des algorithmes",
          sous_cartons: [],
        },
      },
    ],
  };
  const carton_ordinateur = new Carton(ordinateur);
  const ordinateur_id = await carton_ordinateur.save().then((doc) => doc._id);

  // Ajout du sous-carton matériel, avec ordinateur comme parent
  const materiel = {
    user: "exemple",
    parent: ordinateur_id,
    nom: "Matériel",
    private: false,
    versions: [
      {
        nom: "Basique",
        quoi: { texte: "Des objets" },
        fonction: { texte: "Support physique des calculs d'un ordinateur" },
      },
    ],
  };
  const carton_materiel = new Carton(materiel);
  const materiel_id = await carton_materiel.save().then((doc) => doc._id);

  // Ajout du sous-carton logiciel, avec ordinateur comme parent
  const logiciel = {
    user: "exemple",
    parent: ordinateur_id,
    nom: "Logiciel",
    private: false,
    versions: [
      {
        nom: "Basique",
        quoi: { texte: "Des algorithmes" },
        fonction: {
          texte: "Dit comment et dans quel ordre les calculs sont fait",
        },
      },
    ],
  };
  const carton_logiciel = new Carton(logiciel);
  const logiciel_id = await carton_logiciel.save().then((doc) => doc._id);

  // Mise à jour de la liste de sous-cartons d'ordinateur
  // avec l'id reçu de matériel
  ordinateur.versions[0].comment.sous_cartons.push(materiel_id);
  ordinateur.versions[0].comment.sous_cartons.push(logiciel_id);
  ordinateur.versions[0].comment.texte = `Avec des {${materiel_id}} et des {${logiciel_id}}.`;
  await Carton.findByIdAndUpdate(ordinateur_id, ordinateur);
}

module.exports = { populate };
