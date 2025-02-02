const { createClient } = require("redis");

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

(async () => {
  try {
    console.log(
      `Connecting to Redis at redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    );
    await redisClient.connect();
    console.log("✅ Connected to Redis");
  } catch (error) {
    console.error("Redis connection error:", error);
  }
})();

module.exports = redisClient;
