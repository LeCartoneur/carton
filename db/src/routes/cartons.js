const express = require("express");
const router = express.Router();
const Carton = require("../Carton.model");

// Récupère la liste de tous les cartons (et sous-cartons)
router.get("/list", async (req, res) => {
  console.log(`[GET] /cartons/list`);
  const cartons = await Carton.find();
  res.json(cartons);
});

// Récupère un carton par son _id.
// req.body.sous_carton (bool) contrôle si
// on renvoie également les sous cartons.
router.post("/get", async (req, res) => {
  console.log(`[POST] /cartons/get: id = ${req.body.id}`);
  const carton = await Carton.findById(req.body.id);
  if (!req.body.sous_carton) {
    res.json(carton);
  } else {
    for (let v of carton.versions) {
      Object.assign(v.comment_cartons, await getSubCartons(v.comment_cartons));
      Object.assign(v.quoi_cartons, await getSubCartons(v.quoi_cartons));
      Object.assign(
        v.fonction_cartons,
        await getSubCartons(v.fonction_cartons)
      );
    }
    res.json(carton);
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
  console.log(`[POST] /cartons/add`);
  const carton = new Carton(req.body);
  await carton.save().then((doc) => {
    res.json({ id: doc._id });
  });
});

// Met à jour un carton existant
router.post("/update", async (req, res) => {
  console.log(`[POST] /cartons/update: id = ${req.body.id}`);
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
            v.comment_cartons,
            await getSubCartons(v.comment_cartons)
          );
          Object.assign(v.quoi_cartons, await getSubCartons(v.quoi_cartons));
          Object.assign(
            v.fonction_cartons,
            await getSubCartons(v.fonction_cartons)
          );
        }
        res.json(doc);
      }
    }
  );
});

// Supprime tous les cartons
router.delete("/reset", async (req, res) => {
  console.log(`[DELETE] /cartons/reset`);
  await Carton.deleteMany().then(() => {
    res.json("Base reset");
  });
});

module.exports = router;
