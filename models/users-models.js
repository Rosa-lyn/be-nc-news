const knex = require("../db/connection");

exports.getUserByUsername = (username) => {
  console.log(username, "USERNAME");
  return knex
    .select("*")
    .from("users")
    .where("username", username)
    .then((user) => {
      return user[0];
    });
};
