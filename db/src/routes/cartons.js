const express = require("express");
const router = express.Router();
const Carton = require("../Carton.model");

// Récupère la liste de tous les cartons (et sous-cartons)
router.get("/list", async (req, res) => {
  const cartons = await Carton.find();
  res.json(cartons);
});

// Récupère un carton par son _id.
// req.body.sous_carton (bool) contrôle si
// on renvoie également les sous cartons.
router.get("/get", async (req, res) => {
  const carton = await Carton.findById(req.body.id);
  const carton_bis = await Carton.findById("5ec2dca4577cd10019ee1bde");
  if (!req.body.sous_carton) {
    res.json(carton);
  } else {
    for (let v of carton.versions) {
      Object.assign(v.comment_cartons, await getSubCartons(v.comment_cartons));
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
  const carton = new Carton(req.body);
  await carton.save().then((doc) => {
    res.json({ id: doc._id });
  });
});

// Met à jour un carton existant
router.post("/update", async (req, res) => {
  console.log(req.body.update);

  await Carton.findByIdAndUpdate(
    req.body.id,
    req.body.update,
    { new: true },
    (err, doc) => {
      res.json(doc);
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
