const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

const connDb = mongoose.createConnection(process.env.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const Carton = connDb.model("Carton", require("./models/Carton.model"));

const connDbUsers = mongoose.createConnection(process.env.MONGO_URL_USERS, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const User = connDbUsers.model("User", require("./models/User.model.js"));
const AlphaKey = connDbUsers.model(
  "AlphaKey",
  require("./models/AlphaKey.model.js")
);

async function closeConnections() {
  try {
    mongoose.disconnect();
  } catch (error) {}
}

module.exports = {
  Carton,
  User,
  AlphaKey,
  connDb,
  connDbUsers,
  closeConnections,
};
