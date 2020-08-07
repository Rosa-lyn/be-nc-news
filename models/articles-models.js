const knex = require("../db/connection");
const { offset } = require("../db/connection");

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
          msg: "Article not found :(",
        });
      }
      const commentCount = Number(articleRows[0].comment_count);
      articleRows[0].comment_count = commentCount;
      // console.log(articleRows[0]);
      return articleRows[0];
    });
};

exports.patchArticleByArticleId = (articleId, incVotes = 0) => {
  return knex("articles")
    .increment("votes", incVotes)
    .where("article_id", articleId)
    .returning("*")
    .then((articleRows) => {
      if (articleRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found :(",
        });
      }
      return articleRows[0];
    });
};

exports.postCommentToArticle = (username, body, articleId) => {
  console.log(articleId);
  return knex
    .select("*")
    .from("articles")
    .where("article_id", articleId)
    .then((articleRows) => {
      if (articleRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found :(",
        });
      } else
        return knex
          .insert({ author: username, article_id: articleId, body })
          .into("comments")
          .returning(["comment_id", "votes", "created_at", "author", "body"])
          .then((commentRows) => {
            return commentRows[0];
          });
    });
};

exports.getCommentsByArticleId = (
  articleId,
  sortBy = "created_at",
  order = "desc"
) => {
  return knex
    .select("comment_id", "votes", "created_at", "author", "body")
    .from("comments")
    .where("article_id", articleId)
    .orderBy(sortBy, order);
};

exports.getArticles = (
  sortBy = "created_at",
  order = "desc",
  author,
  topic,
  limit = 10,
  page = 1
) => {
  const offsetValue = (page - 1) * limit;
  return knex
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sortBy, order)
    .modify((query) => {
      if (author) query.where("articles.author", author);
      if (topic) query.where("articles.topic", topic);
    })
    .limit(limit)
    .offset(offsetValue)
    .then((articleRows) => {
      articleRows.forEach((article) => {
        article.comment_count = Number(article.comment_count);
      });
      return articleRows;
    });
};
