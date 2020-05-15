const connectDb = require("./src/connection");
const Carton = require("./src/Carton.model");
const express = require("express");
const app = express();

app.use(express.json());

const port = process.env.PORT || 8000;

connectDb().then(() => {
  console.log("Successful connection to db.");
});

app.get("/cartons", async (req, res) => {
  const cartons = await Carton.find();
  res.json(cartons);
});

app.post("/post-carton", async (req, res) => {
  console.log(req.body);

  const carton = new Carton({ user: "admin", nom: req.body.name });

  await carton.save().then(() => {
    res.send("ok");
  });
});

app.post("/update-carton", async (req, res) => {
  console.log(req.body.update);

  await Carton.findByIdAndUpdate(
    req.body.id,
    req.body.update,
    { new: true },
    (err, doc) => {
      res.json(doc);
    }
  );
});

app.delete("/reset", async (req, res) => {
  await Carton.deleteMany().then(() => {
    res.send("Base reset");
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
