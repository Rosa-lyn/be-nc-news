const knex = require("../db/connection");

exports.getArticleByArticleId = (articleId) => {
  return knex
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", articleId)
    .then((articleRows) => {
      if (articleRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article: ${articleId} not found :(`,
        });
      }
      const commentCount = Number(articleRows[0].comment_count);
      articleRows[0].comment_count = commentCount;
      return articleRows[0];
    });
};
exports.patchArticleByArticleId = (articleId, incVotes) => {
  if (incVotes === undefined) {
    return Promise.reject({
      status: 400,
      msg:
        "Missing required fields on request body :( Body must be in the form { inc_votes: newVote }",
    });
  }
  return knex("articles")
    .increment("votes", incVotes)
    .where("article_id", articleId)
    .returning("*")
    .then((articleRows) => {
      if (articleRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article: ${articleId} not found :(`,
        });
      }
      return articleRows[0];
    });
};
