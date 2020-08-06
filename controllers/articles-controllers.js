const {
  getArticleByArticleId,
  patchArticleByArticleId,
  postCommentToArticle,
  getCommentsByArticleId,
  getArticles,
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

exports.addCommentToArticle = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id: articleId } = req.params;
  postCommentToArticle(username, body, articleId)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.sendCommentsByArticleId = (req, res, next) => {
  const { article_id: articleId } = req.params;
  const { sort_by: sortBy, order } = req.query;
  getCommentsByArticleId(articleId, sortBy, order)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};

exports.sendArticles = (req, res, next) => {
  const { sort_by: sortBy, order, author, topic } = req.query;
  getArticles(sortBy, order, author, topic).then((articles) => {
    res.send({ articles });
  });
};
