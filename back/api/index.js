const { connDb, connDbUsers } = require("./src/connection.js");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const port = process.env.PORT || 8000;

// Express app middlewares
const app = express();
app.use(
  cors({
    origin: [
      "https://carton.netlify.app",
      "https://api.carton.combiendecarbone.fr",
    ],
    //origin: ["http://localhost:8000", "http://localhost:8080"],
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("common"));

// Express session with redis
app.use(
  session({
    genid: (req) => {
      return uuidv4();
    },
    store: require("./src/redis.js").redisStore,
    name: "_redisDemo",
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60,
      sameSite: "none",
    }, // Set to secure:false and expire in 1 minute for demo purposes
    saveUninitialized: true,
  })
);

/* app.use((req, res, next) => {
  req.session.user = "toto";
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  console.log(req.session.count);
  next();
}); */

// API routes
app.use("/cartons", require("./src/routes/cartons"));
app.use("/keys", require("./src/routes/keys"));
app.use("/users", require("./src/routes/users"));

// Connections to databases
connDb.then(() => {
  console.log("Successful connection to db.");
});
connDbUsers.then(() => {
  console.log("Successful connection to Users db.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
