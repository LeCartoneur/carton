const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  key_id: {
    type: String,
    required: true,
  },
  pseudo: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: () => Date.now(),
  },
  pwd_hash: {
    type: String,
    required: true,
  },
});

module.exports = userSchema;
