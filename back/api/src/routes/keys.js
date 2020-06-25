const argon2 = require("argon2");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { AlphaKey } = require("../connection.js");

router.post("/new", async (req, res) => {
  try {
    let new_key = uuidv4();
    while (await AlphaKey.findOne({ value: new_key })) {
      new_key = uuidv4();
    }
    const doc = await AlphaKey.create({ value: new_key });
    res.json(doc).end();
  } catch (err) {
    console.log(err);
    res.send(400).end();
  }
});

router.get("/list", async (req, res) => {
  try {
    const docs = await AlphaKey.find();
    res.json(docs).end();
  } catch (err) {
    console.log(err);
    res.send(400).end();
  }
});

module.exports = router;
