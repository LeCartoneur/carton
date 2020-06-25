const mongoose = require("mongoose");
const alphaKeySchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  iat: {
    type: Date,
    default: () => Date.now(),
  },
  registered: {
    type: Boolean,
    default: false,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
});

module.exports = alphaKeySchema;
