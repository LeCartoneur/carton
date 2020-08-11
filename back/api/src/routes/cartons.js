const express = require("express");
const router = express.Router();
const { Carton } = require("../connection");
const { generateCategories } = require("../plugins/populate.js");

// Récupère la liste de tous les cartons originels
router.get("/list", async (req, res) => {
  try {
    const cartons = await Carton.find();
    res.json(cartons.filter((carton) => !carton.parent));
  } catch {
    res.status(500).end();
  }
});

// Récupère la liste de tous les cartons (originels et sous-cartons)
router.get("/list/all", async (req, res) => {
  try {
    const cartons = await Carton.find();
    res.json(cartons);
  } catch {
    res.status(500).end();
  }
});

// Récupère un carton par son _id.
// req.body.sous_carton (bool) contrôle si
// on renvoie également les sous cartons.
router.get("/:id", async (req, res) => {
  const carton_id = req.params.id;
  const sous_carton = req.query.sous_cartons | false;
  try {
    const carton = await Carton.findById(carton_id);
    if (carton) {
      if (!sous_carton) {
        res.json(carton);
      } else {
        Object.assign(carton, await populateVersions(carton));
        res.json(carton);
      }
    } else {
      res.status(404).end();
    }
  } catch {
    res.status(500).end();
  }
});

// For every version of the carton, populate the types
// ["comment", "quoi", "fonction", "exemples"] with the
// corresponding sub-cartons.
async function populateVersions(carton) {
  try {
    for (let v of carton.versions) {
      for (let type of ["comment", "quoi", "fonction", "exemples"]) {
        Object.assign(
          v[type].sous_cartons,
          await getSubCartons(v[type].sous_cartons)
        );
      }
    }
    return carton;
  } catch (err) {
    return Promise.reject(err);
  }
}

// Return a list of carton objects from a list of sub-carton
// objects {carton_id, version_id}
async function getSubCartons(list) {
  try {
    let cartons = [];
    for (let carton of list) {
      let res = await Carton.findById(carton.carton_id).lean();
      if (res) {
        let categories = {};
        if (res.versions[carton.version_id]) {
          categories = res.versions[carton.version_id];
        } else {
          let id_default = res.versions.find((ver) => ver.nom === "default");
          categories = res.versions[id_default];
        }
        delete categories.nom;
        delete categories._id;
        delete res.versions;
        cartons.push({ ...res, ...categories });
      }
    }
    return cartons;
  } catch (err) {
    return Promise.reject(err);
  }
}

// Ajoute un nouveau carton
router.post("/add", async (req, res) => {
  try {
    const carton = new Carton(req.body);
    await carton.save().then((doc) => {
      res.status(201).json({ id: doc._id });
    });
  } catch {
    res.status(400).end();
  }
});

// Met à jour un carton existant
router.post("/update", async (req, res) => {
  try {
    const operations = ["push", "set", "pull"];
    await Promise.all(
      req.body.updates.map((update) => {
        if (operations.includes(update.operation)) {
          return Carton.findByIdAndUpdate(req.body.id, {
            [`$${update.operation}`]: {
              [update.path]: update.value,
            },
          });
        } else {
          return Promise.reject("Error: operation not specified");
        }
      })
    );
  } catch (error) {
    res.status(400).send(error);
  } finally {
    res.end();
  }
});

// Delete a carton given its id. Recursively delete its sous-carton.
router.delete("/delete", async (req, res) => {
  // TODO: ajouter vérification user === carton.user
  // TODO: faire les suppressions au sein d'une transaction
  // https://mongoosejs.com/docs/transactions.html
  try {
    await deleteSousCartons(req.body.id);
  } catch (err) {
    res.status(400).send(err);
  } finally {
    res.status(200).end();
  }
});

/**
 * Recursively delete the sous-cartons of a carton
 * @param {Mongoose.ObjectId} carton_id Valid carton id
 */
async function deleteSousCartons(carton_id) {
  try {
    const sous_cartons = await getSousCartonsFlat(carton_id);
    await Promise.all(
      sous_cartons.map((sous_carton_id) => {
        deleteSousCartons(sous_carton_id);
      })
    );
    await Carton.findByIdAndDelete(carton_id);
  } catch (err) {
    return Promise.reject(err);
  } finally {
    return Promise.resolve();
  }
}

/**
 * Return a flat list of all sous-cartons ids from all categories of
 * a given carton.
 * @param {Mongoose.ObjectId} carton_id Valid carton id
 */
async function getSousCartonsFlat(carton_id) {
  let sous_cartons_flat = [];
  try {
    let carton = await Carton.findById(carton_id);
    if (carton.versions.length)
      carton.versions.forEach((v) => {
        ["quoi", "comment", "fonction", "exemples", "plus_loin"].forEach(
          (cat) => {
            v[cat].sous_cartons.forEach((sous_carton) =>
              sous_cartons_flat.push(sous_carton.carton_id)
            );
          }
        );
      });
  } catch (err) {
    console.log(err);
    return Promise.reject();
  } finally {
    return Promise.resolve(sous_cartons_flat);
  }
}

// Si on est dans l'alpha, la route supprime les cartons existants
// et insère des dummy cartons dans la base vide.
if (process.env.ALPHA === "true") {
  router.post("/reset", async (req, res) => {
    if (req.body.mdp === process.env.RESET_KEY) {
      await Carton.deleteMany();
      await generateCategories();
      res.status(205).end();
    } else {
      res.status(404).end();
    }
  });
}

module.exports = router;
