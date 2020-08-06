const articlesRouter = require("express").Router();
const {
  sendArticleByArticleId,
  updateArticleByArticleId,
  addCommentToArticle,
  sendCommentsByArticleId,
  sendArticles,
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/:article_id")
  .get(sendArticleByArticleId)
  .patch(updateArticleByArticleId);

articlesRouter
  .route("/:article_id/comments")
  .post(addCommentToArticle)
  .get(sendCommentsByArticleId);

articlesRouter.route("/").get(sendArticles);

module.exports = articlesRouter;
