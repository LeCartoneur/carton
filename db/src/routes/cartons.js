const express = require("express");
const router = express.Router();
const Carton = require("../Carton.model");

router.get("/list", async (req, res) => {
  const cartons = await Carton.find();
  res.json(cartons);
});

router.post("/add", async (req, res) => {
  const carton = new Carton(req.body);
  await carton.save().then((doc) => {
    res.json({ id: doc._id });
  });
});

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

router.delete("/reset", async (req, res) => {
  await Carton.deleteMany().then(() => {
    res.json("Base reset");
  });
});

module.exports = router;
