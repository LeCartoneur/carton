const api = require("./api");

async function main() {
  // Reset de la base de données
  await api.resetCartons();

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
  let res = await api.insertCarton(ordinateur);
  const ordinateur_id = res.body.id;

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
  res = await api.insertCarton(materiel);
  const materiel_id = res.body.id;
  ordinateur.versions[0].comment.sous_cartons.push(materiel_id);

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
  res = await api.insertCarton(logiciel);

  // Mise à jour de la liste de sous-cartons d'ordinateur
  // avec l'id reçu de matériel
  const logiciel_id = res.body.id;
  ordinateur.versions[0].comment.sous_cartons.push(logiciel_id);
  ordinateur.versions[0].comment.texte = `Avec des {${materiel_id}} et des {${logiciel_id}}`;
  await api.updateCarton(ordinateur_id, ordinateur);
}

(() => {
  main();
})();
