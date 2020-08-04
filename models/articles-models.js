const knex = require("../db/connection");

exports.getArticlesByArticleId = (articleId) => {
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
