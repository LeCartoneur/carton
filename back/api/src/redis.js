const redis = require("redis");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

// Redis Store
const redisClient = redis.createClient(process.env.REDIS_URL);
redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});
const redisStore = new RedisStore({ client: redisClient });

function getAllActiveSessions() {
  return new Promise((resolve, reject) => {
    redisStore.all(function (err, sessions) {
      if (err) reject(err);
      else resolve(sessions);
    });
  });
}

module.exports = { redisStore, getAllActiveSessions };
