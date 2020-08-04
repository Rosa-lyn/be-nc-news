const { getArticlesByArticleId } = require("../models/articles-models");

exports.sendArticlesByArticleId = (req, res, next) => {
  const { article_id: articleId } = req.params;
  getArticlesByArticleId(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
