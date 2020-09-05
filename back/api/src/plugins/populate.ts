import { carton_model } from "../connection";
import {} from "../models/Carton.model";
import { LoremIpsum } from "lorem-ipsum";
import mongoose from "mongoose";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 6,
    min: 2,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

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
  const carton_ordinateur = new carton_model(ordinateur);
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
  const carton_materiel = new carton_model(materiel);
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
  const carton_logiciel = new carton_model(logiciel);
  const logiciel_id = await carton_logiciel.save().then((doc) => doc._id);

  // Mise à jour de la liste de sous-cartons d'ordinateur
  // avec l'id reçu de matériel
  ordinateur.versions[0].comment.sous_cartons.push({ carton_id: materiel_id });
  ordinateur.versions[0].comment.sous_cartons.push({ carton_id: logiciel_id });
  ordinateur.versions[0].comment.texte = `Avec des {${materiel_id}}(matériels) et des {${logiciel_id}}(logiciels).`;
  await carton_model.findByIdAndUpdate(
    ordinateur_id,
    new carton_model(ordinateur)
  );
}

/**
 * Generate the sous-cartons for each categories. Recursively add the
 * sous-cartons for the added sous-cartons.
 * @param {ObjectId} carton_id Id of the carton
 * @param {Number} depth Current depth value
 */
async function generateCategories(
  carton_id?: mongoose.Types.ObjectId,
  depth = 0
) {
  const max_depth = 5;
  if (!carton_id) {
    carton_id = (await createCarton()).carton_id;
  }
  const carton = await carton_model.findById(carton_id);
  // Generate sous-cartons for all categories
  await Promise.all(
    ["quoi", "fonction", "comment"].map(async (cat) => {
      // Generate sous-cartons
      let sous_cartons = getArrBySize(
        getRandomInt(max_depth - depth, depth === 0 ? 1 : 0)
      );
      await Promise.all(
        sous_cartons.map(async (_, idx) => {
          sous_cartons[idx] = await createCarton(carton_id);
        })
      );
      // Update carton's sous_cartons list
      carton.versions[0][cat].sous_cartons = sous_cartons.map((ssc) => {
        return { carton_id: ssc.carton_id, version_id: 0 };
      });

      // Update carton's text description
      carton.versions[0][cat].texte = generateText(sous_cartons);
    })
  );
  // Save current carton
  await carton.save();

  // Generate categories for sous-cartons
  await Promise.all(
    ["quoi", "fonction", "comment"].map(async (cat) => {
      carton.versions[0][cat].sous_cartons.map(async (ssc) => {
        await generateCategories(ssc.carton_id, depth + 1);
      });
    })
  );
}

/**
 * Create a new carton attached to a given carton with a random name.
 * @param {Number} parent_id Id of the parent carton. If not provided, create
 * and originel carton.
 */
async function createCarton(parent_id = null) {
  let carton = new carton_model({ nom: getRandomMot(), parent: parent_id });
  return carton.save().then((doc) => {
    return { nom: doc.nom, carton_id: doc._id };
  });
}

/**
 * Generate a random text with links taken from the list of sous-cartons.
 * @param {Array} sous_cartons Array of sous cartons
 */
function generateText(sous_cartons) {
  let txt = lorem.generateParagraphs(2).split(" ");
  let idx = [];
  sous_cartons.forEach((ssc) => {
    let id = getRandomInt(txt.length);
    while (idx.includes(id)) {
      id = getRandomInt(txt.length);
    }
    idx.push(id);
    txt[id] = `{${ssc.carton_id}}(${ssc.nom})`;
  });
  return txt.join(" ");
}

/**
 * Pick a random word from the list `mots`
 */
function getRandomMot() {
  return mots[getRandomInt(mots.length - 1)];
}

/**
 * Draw a random integer in [min_int, max_int]
 * @param {Integer} max_int Max value
 * @param {Integer} min_int Min value, 0 if not provided
 */
function getRandomInt(max_int, min_int = 0) {
  return min_int + Math.floor(Math.random() * Math.floor(max_int - min_int));
}

/**
 * Return an array with a given size.
 * @param {Integer} length Size of the desired array
 * @param {Number | String} value Default values for the array, default is 1
 */
function getArrBySize(length, value = 1) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(value);
  }
  return arr;
}

const mots = [
  "Selle",
  "Interne",
  "Escorte",
  "Gros",
  "Soulever",
  "Jambon",
  "Religion",
  "Arrêter",
  "Invitation",
  "Alpinisme",
  "Élevé",
  "Charlatan",
  "Prison",
  "Berceau",
  "Renard",
  "Soufre",
  "Larynx",
  "Conceptuel",
  "Robinet",
  "Coffre",
  "Civil",
  "Déclarer",
  "Plume",
  "Veine",
  "Inhaler",
  "Annoter",
  "Suisse",
  "Rampant",
  "Adhésif",
  "Muletier",
  "Tonne",
  "Passeport",
  "Escrime",
  "Feuilleter",
  "Motel",
  "Petit déjeuner",
  "Malheureux",
  "Baignoire",
  "Cocotte",
];

export { populate, generateCategories };
