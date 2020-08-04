const articlesRouter = require("express").Router();
const {
  sendArticlesByArticleId,
} = require("../controllers/articles-controllers");

articlesRouter.route("/:article_id").get(sendArticlesByArticleId);

module.exports = articlesRouter;
