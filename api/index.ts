import { connDb } from "./src/connection";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import carton from "./src/routes/cartons";

const port = process.env.PORT || 8000;

// Express app middlewares
const app = express();
app.set("query parser", "simple"); // prevent parsing objects in query params
app.use(cors());
app.use(express.json());
app.use(morgan("common"));

// API routes
app.use("/cartons", carton);

// Connections to databases
connDb.then(() => {
  console.log("Successful connection to db.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
