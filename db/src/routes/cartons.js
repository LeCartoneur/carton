const express = require("express");
const router = express.Router();
const Carton = require("../Carton.model");

// Récupère la liste de tous les cartons (et sous-cartons)
router.get("/list", async (req, res) => {
  const cartons = await Carton.find();
  res.json(cartons);
});

// Récupère un carton par son _id
router.get("/get", async (req, res) => {
  const carton = await Carton.findById(req.body.id);
  res.json(carton);
});

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
