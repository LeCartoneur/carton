import mongoose from "mongoose";
import cartonModel, { Carton } from "./models/Carton.model";

mongoose.set("useFindAndModify", false);
const connDb = mongoose.createConnection(
  process.env.MONGO_URL || "mongodb://mongo:27017/cartons",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);
const Carton = connDb.model<Carton>("Carton", cartonModel);

async function closeConnections() {
  try {
    mongoose.disconnect();
  } catch (error) {}
}

export { Carton, connDb, closeConnections };
