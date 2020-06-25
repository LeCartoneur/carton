const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const connDb = mongoose.createConnection(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const Carton = connDb.model("Carton", require("./Carton.model"));

const connDbUsers = mongoose.createConnection(process.env.MONGO_URL_USERS, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const User = connDbUsers.model("User", require("./User.model.js"));
const AlphaKey = connDbUsers.model("AlphaKey", require("./AlphaKey.model.js"));

module.exports = { Carton, User, AlphaKey, connDb, connDbUsers };
