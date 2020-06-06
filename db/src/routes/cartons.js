const express = require("express");
const router = express.Router();
const Carton = require("../Carton.model");

// Récupère la liste de tous les cartons (et sous-cartons)
router.get("/list", async (req, res) => {
  const cartons = await Carton.find();
  res.json(cartons.filter((carton) => !carton.parent));
});

// Récupère un carton par son _id.
// req.body.sous_carton (bool) contrôle si
// on renvoie également les sous cartons.
router.post("/get", async (req, res) => {
  const carton = await Carton.findById(req.body.id);
  if (carton) {
    if (!req.body.sous_carton) {
      res.json(carton);
    } else {
      for (let v of carton.versions) {
        Object.assign(
          v.comment.sous_cartons,
          await getSubCartons(v.comment.sous_cartons)
        );
        Object.assign(
          v.quoi.sous_cartons,
          await getSubCartons(v.quoi.sous_cartons)
        );
        Object.assign(
          v.fonction.sous_cartons,
          await getSubCartons(v.fonction.sous_cartons)
        );
      }
      res.json(carton);
    }
  } else {
    res.status(404).end();
  }
});

// Return a list of carton objects from a list of carton ids.
async function getSubCartons(list) {
  let cartons = [];
  for (const id of list) {
    cartons.push(await Carton.findById(id));
  }
  return cartons;
}

// Ajoute un nouveau carton
router.post("/add", async (req, res) => {
  const carton = new Carton(req.body);
  await carton.save().then((doc) => {
    res.json({ id: doc._id });
  });
});

// Met à jour un carton existant
router.post("/update", async (req, res) => {
  await Carton.findByIdAndUpdate(
    req.body.id,
    req.body.update,
    { new: true },
    async (err, doc) => {
      if (!req.body.sous_carton) {
        res.json(doc);
      } else {
        for (let v of doc.versions) {
          Object.assign(
            v.comment.sous_cartons,
            await getSubCartons(v.comment.sous_cartons)
          );
          Object.assign(
            v.quoi.sous_cartons,
            await getSubCartons(v.quoi.sous_cartons)
          );
          Object.assign(
            v.fonction.sous_cartons,
            await getSubCartons(v.fonction.sous_cartons)
          );
        }
        res.json(doc);
      }
    }
  );
});

// Supprime tous les cartons
router.delete("/reset", async (req, res) => {
  await Carton.deleteMany().then(() => {
    res.json("Base reset");
  });
});

module.exports = router;
