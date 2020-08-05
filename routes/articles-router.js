const articlesRouter = require("express").Router();
const {
  sendArticleByArticleId,
  updateArticleByArticleId,
} = require("../controllers/articles-controllers");

articlesRouter
  .route("/:article_id")
  .get(sendArticleByArticleId)
  .patch(updateArticleByArticleId);

module.exports = articlesRouter;
