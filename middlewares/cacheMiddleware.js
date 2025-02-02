const redisClient = require("../config/redis");
const validateMongoDbId = require("../utils/validateMongodbId");

const allUsersCache = async (req, res, next) => {
  try {
    const cacheKey = req.originalUrl;
    const data = await redisClient.get(cacheKey); // Use async/await instead of callback

    if (data !== null) {
      let response = JSON.parse(data);
      console.log(`🔹 Cache hit for ${cacheKey}`);
      return res.status(response.statusCode).json(response);
    }

    next();
  } catch (error) {
    next(); // Continue request even if Redis fails
  }
};
const getUserDetailsCache = async (req, res, next) => {
  try {
    const { id } = req.user;
    validateMongoDbId(id);
    const cacheKey = `userDetails:${id}`; // Unique cache key for each user

    const data = await redisClient.get(cacheKey);

    if (data !== null) {
      console.log(data);

      let response = JSON.parse(data);
      return res.status(response.statusCode).json(response);
    }
    console.log(`⚠️ Cache miss for ${cacheKey}`);

    next();
  } catch (error) {
    console.error("❌ Redis Middleware Error:", error);
    throw new Error(error);
  }
};
const restPasswordCache = async (req, res, next) => {
  try {
    const { email } = req.body;

    const cacheKey = `resetPasswordForEmail:${email}`; // Unique cache key for each user

    const data = await redisClient.get(cacheKey);

    if (data !== null) {
      console.log(data);

      let response = JSON.parse(data);
      return res.status(response.statusCode).json(response);
    }
    console.log(`⚠️ Cache miss for ${cacheKey}`);

    next();
  } catch (error) {
    console.error("❌ Redis Middleware Error:", error);
    throw new Error(error);
  }
};
const passTokenCache = async (req, res, next) => {
  try {
    const { token } = req.params;

    const cacheKey = `passwordToken:${token}`; // Unique cache key for each user

    const data = await redisClient.get(cacheKey);

    if (data !== null) {
      console.log(data);

      let response = JSON.parse(data);
      return res.status(response.statusCode).json(response);
    }
    console.log(`⚠️ Cache miss for ${cacheKey}`);

    next();
  } catch (error) {
    console.error("❌ Redis Middleware Error:", error);
    throw new Error(error);
  }
};
const emailTokenCache = async (req, res, next) => {
  try {
    const { token } = req.params;

    const cacheKey = `emailToken:${token}`; // Unique cache key for each user

    const data = await redisClient.get(cacheKey);

    if (data !== null) {
      console.log(data);

      let response = JSON.parse(data);
      return res.status(response.statusCode).json(response);
    }
    console.log(`⚠️ Cache miss for ${cacheKey}`);

    next();
  } catch (error) {
    console.error("❌ Redis Middleware Error:", error);
    throw new Error(error);
  }
};
const getUserDataCache = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const cacheKey = `user:${id}`; // Unique cache key for each user

    const data = await redisClient.get(cacheKey);

    if (data !== null) {
      console.log(data);

      let response = JSON.parse(data);
      return res.status(response.statusCode).json(response);
    }
    console.log(`⚠️ Cache miss for ${cacheKey}`);

    next();
  } catch (error) {
    console.error("❌ Redis Middleware Error:", error);
    throw new Error(error);
  }
};
const userPharmaciesCache = async (req, res, next) => {
  try {
    const { id } = req.user;
    validateMongoDbId(id);
    const cacheKey = `pharmaciesForUser:${id}`; // Unique cache key for each user

    const data = await redisClient.get(cacheKey);

    if (data !== null) {
      console.log(data);

      let response = JSON.parse(data);
      return res.status(response.statusCode).json(response);
    }
    console.log(`⚠️ Cache miss for ${cacheKey}`);

    next();
  } catch (error) {
    console.error("❌ Redis Middleware Error:", error);
    throw new Error(error);
  }
};
module.exports = {
  allUsersCache,
  getUserDetailsCache,
  restPasswordCache,
  passTokenCache,
  emailTokenCache,
  getUserDataCache,
  userPharmaciesCache,
};
