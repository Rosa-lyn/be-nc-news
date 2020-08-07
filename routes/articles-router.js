const articlesRouter = require("express").Router();
const {
  sendArticleByArticleId,
  updateArticleByArticleId,
  addCommentToArticle,
  sendCommentsByArticleId,
  sendArticles,
} = require("../controllers/articles-controllers");
const { handleInvalidMethods } = require("../errors");

articlesRouter
  .route("/:article_id")
  .get(sendArticleByArticleId)
  .patch(updateArticleByArticleId)
  .all(handleInvalidMethods);

articlesRouter
  .route("/:article_id/comments")
  .post(addCommentToArticle)
  .get(sendCommentsByArticleId)
  .all(handleInvalidMethods);

articlesRouter.route("/").get(sendArticles).all(handleInvalidMethods);

module.exports = articlesRouter;
