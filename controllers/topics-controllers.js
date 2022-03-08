const { getTopics } = require("../models/topics-models");

exports.sendTopics = (req, res, next) => {
  getTopics()
    .then((topics) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Max-Age", "1800");
      res.setHeader("Access-Control-Allow-Headers", "content-type");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "PUT, POST, GET, DELETE, PATCH, OPTIONS"
      );
      res.send({ topics });
    })
    .catch(next);
};
