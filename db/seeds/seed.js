const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);
      const usersInsertions = knex("users").insert(userData);
      console.log("seeding topics table... seeding users table...");
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      // console.log(articleData);
      const formattedArticles = formatDates(articleData);
      console.log("seeding articles table...");
      return knex("articles").insert(formattedArticles).returning("*");
    })
    .then((articleRows) => {
      const articleRef = makeRefObj(articleRows);
      console.log(articleRef);
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments").insert(formattedComments);
    });
};
