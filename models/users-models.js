const knex = require("../db/connection");

exports.getUserByUsername = (username) => {
  return knex
    .select("*")
    .from("users")
    .where("username", username)
    .then((userRows) => {
      if (userRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "User not found :(",
        });
      } else return userRows[0];
    });
};
