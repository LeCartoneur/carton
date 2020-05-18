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
        quoi_texte: "Un outil humain",
        fonction_texte: "Fait des calculs",
        comment_texte: "Avec des transistors et des algorithmes",
        comment_cartons: [],
        exemples_texte: "Ordinateur de bureau, smartphone, serveur.",
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
        quoi_texte: "Des objets",
        fonction_texte: "Support physique des calculs d'un ordinateur",
      },
    ],
  };
  res = await api.insertCarton(materiel);

  // Mise à jour de la liste de sous-cartons d'ordinateur
  // avec l'id reçu de matériel
  const materiel_id = res.body.id;
  ordinateur.versions[0].comment_cartons.push(materiel_id);
  await api.updateCarton(ordinateur_id, ordinateur);

  // Ajout du sous-carton logiciel, avec ordinateur comme parent
  const logiciel = {
    user: "exemple",
    parent: ordinateur_id,
    nom: "Logiciel",
    private: false,
    versions: [
      {
        nom: "Basique",
        quoi_texte: "Des algorithmes",
        fonction_texte: "Dit comment et dans quel ordre les calculs sont fait",
      },
    ],
  };
  res = await api.insertCarton(logiciel);

  // Mise à jour de la liste de sous-cartons d'ordinateur
  // avec l'id reçu de matériel
  const logiciel_id = res.body.id;
  ordinateur.versions[0].comment_cartons.push(logiciel_id);
  await api.updateCarton(ordinateur_id, ordinateur);
}

(() => {
  main();
})();
