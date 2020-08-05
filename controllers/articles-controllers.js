const {
  getArticleByArticleId,
  patchArticleByArticleId,
} = require("../models/articles-models");

exports.sendArticleByArticleId = (req, res, next) => {
  const { article_id: articleId } = req.params;
  getArticleByArticleId(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleByArticleId = (req, res, next) => {
  const { article_id: articleId } = req.params;
  const { inc_votes: incVotes } = req.body;
  patchArticleByArticleId(articleId, incVotes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
