const endpoints = require("../endpoints.json");

exports.sendEndpoints = (req, res, next) => {
  res.json({ endpoints });
};
