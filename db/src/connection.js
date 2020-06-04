const mongoose = require("mongoose");
const Carton = require("./Carton.model");
const connection = "mongodb://mongo:27017/cartons";

mongoose.set("useFindAndModify", false);

const connectDb = () => {
  return mongoose.connect(connection, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

module.exports = connectDb;
