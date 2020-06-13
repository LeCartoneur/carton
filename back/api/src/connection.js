const mongoose = require("mongoose");
const Carton = require("./Carton.model");
const connection = process.env.MONGO_URL;

mongoose.set("useFindAndModify", false);

const connectDb = () => {
  return mongoose.connect(connection, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

module.exports = connectDb;
