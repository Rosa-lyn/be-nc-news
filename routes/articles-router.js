const articlesRouter = require("express").Router();
const {
  sendArticleByArticleId,
  updateArticleByArticleId,
  addCommentToArticle,
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/:article_id")
  .get(sendArticleByArticleId)
  .patch(updateArticleByArticleId);

articlesRouter.route("/:article_id/comments").post(addCommentToArticle);

module.exports = articlesRouter;
