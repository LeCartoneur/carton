const connectDb = require("./src/connection");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cartons_routes = require("./src/routes/cartons");
const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("common"));
app.use("/cartons", cartons_routes);

connectDb().then(() => {
  console.log("Successful connection to db.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
