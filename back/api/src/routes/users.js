const argon2 = require("argon2");
const express = require("express");
const router = express.Router();
const { User, AlphaKey } = require("../connection.js");

router.post("/add", async (req, res) => {
  try {
    const key = await AlphaKey.findOne({ value: req.body.alpha_key });
    if (!key) throw { msg: "Cette clé n'existe pas.", code: "custom" };
    if (key.registered)
      throw { msg: "Cette clé est déjà utilisée.", code: "custom" };
    if (key.revoked) throw { msg: "Cette clé a été révoquée.", code: "custom" };
    const hash = await argon2.hash(req.body.pwd);
    await User.create({
      pseudo: req.body.pseudo,
      key_id: key._id,
      pwd_hash: hash,
    });
    key.registered = true;
    await key.save();
  } catch (err) {
    if (err.code === "custom") {
      res.status(400).end(err.msg);
    } else if (err.code === 11000) {
      res.status(400).end("Ce pseudo existe déjà.");
    } else {
      res.status(400).end();
    }
  }
});

module.exports = router;
