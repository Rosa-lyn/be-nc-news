const articlesRouter = require("express").Router();
const {
  sendArticleByArticleId,
  updateArticleByArticleId,
  addCommentToArticle,
  sendCommentsByArticleId,
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/:article_id")
  .get(sendArticleByArticleId)
  .patch(updateArticleByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .post(addCommentToArticle)
  .get(sendCommentsByArticleId);

module.exports = articlesRouter;
