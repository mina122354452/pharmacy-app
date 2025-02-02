const redisClient = require("../config/redis");

const setAllUsersCache = (originalUrl, response) => {
  const cacheKey = originalUrl;
  redisClient.set(cacheKey, JSON.stringify(response), "EX", 3600);
};
const setUserDetailsCache = (id, response) => {
  const cacheKey = `userDetails:${id}`; // Unique cache key for each user
  redisClient.set(cacheKey, JSON.stringify(response), "EX", 1209600); // 1209600 seconds = 2 weeks
};
const invalidateUserCache = (id) => {
  const cacheKey = `userDetails:${id}`;
  redisClient.del(cacheKey, (err) => {
    if (err) throw err;
    console.log(`Cache deleted for user: ${id}`);
  });
};
const setRestPasswordCache = (email, response) => {
  const cacheKey = `resetPasswordForEmail:${email}`;
  redisClient.set(cacheKey, JSON.stringify(response), "EX", 600); // 600 seconds = 10 minutes
};
const invalidateRestPasswordCache = (email) => {
  const cacheKey = `resetPasswordForEmail:${email}`;
  redisClient.del(cacheKey, (err) => {
    if (err) throw err;
    console.log(`Cache deleted for user: ${id}`);
  });
};
const setPassTokenCache = (token, response) => {
  const cacheKey = `passwordToken:${token}`;
  redisClient.set(cacheKey, JSON.stringify(response), "EX", 300); // 300 seconds = 5 minutes
};
const setEmailTokenCache = (token, response) => {
  const cacheKey = `emailToken:${token}`;
  redisClient.set(cacheKey, JSON.stringify(response), "EX", 300); // 300 seconds = 5 minutes
};
const setEmailVerificationCache = (email, response) => {
  const cacheKey = `emailVerificationFor:${email}`;
  redisClient.set(cacheKey, JSON.stringify(response), "EX", 600); // 300 seconds = 5 minutes
};
module.exports = {
  setAllUsersCache,
  setUserDetailsCache,
  invalidateUserCache,
  setRestPasswordCache,
  invalidateRestPasswordCache,
  setPassTokenCache,
  setEmailTokenCache,
  setEmailVerificationCache,
};
