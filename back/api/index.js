const { connDb, connDbUsers } = require("./src/connection.js");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("common"));
app.use("/cartons", require("./src/routes/cartons"));
app.use("/keys", require("./src/routes/keys"));
app.use("/users", require("./src/routes/users"));

connDb.then(() => {
  console.log("Successful connection to db.");
});

connDbUsers.then(() => {
  console.log("Successful connection to Users db.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
