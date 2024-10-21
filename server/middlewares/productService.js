const redisClient = require('redis').createClient();

const cacheMiddleware = (req, res, next) => {
  const key = 'products';

  redisClient.get(key, (err, data) => {
    if (err) throw err;
    if (data) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
};
