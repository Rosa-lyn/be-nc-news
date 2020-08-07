const { getUserByUsername } = require("../models/users-models");

exports.sendUserByUsername = (req, res, next) => {
  const { username } = req.params;
  getUserByUsername(username)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};
