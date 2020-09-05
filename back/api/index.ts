import { connDb } from "./src/connection.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
const port = process.env.PORT || 8000;

// Express app middlewares
const app = express();
app.set("query parser", "simple"); // prevent parsing objects in query params
app.use(
  cors({
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);
app.use(express.json());
app.use(morgan("common"));

// API routes
app.use("/cartons", require("./src/routes/cartons"));

// Connections to databases
connDb.then(() => {
  console.log("Successful connection to db.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
