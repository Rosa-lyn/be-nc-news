const knex = require("../db/connection");

exports.getTopics = () => {
  return knex.select("*").from("topics");
};

exports.getTopicBySlug = (slug) => {
  return knex
    .select("*")
    .from("topics")
    .where("slug", slug)
    .then((topicRows) => {
      if (topicRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Topic: ${slug} not found :(`,
        });
      } else return topicRows[0];
    });
};
