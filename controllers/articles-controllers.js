const {
  getArticleByArticleId,
  patchArticleByArticleId,
  postCommentToArticle,
  getCommentsByArticleId,
  getArticles,
  countArticles,
} = require("../models/articles-models");

const { getUserByUsername } = require("../models/users-models");

const { getTopicBySlug } = require("../models/topics-models");

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

  const models = [
    getCommentsByArticleId(articleId, sortBy, order),
    getArticleByArticleId(articleId),
  ];

  Promise.all(models)
    .then(([comments]) => {
      res.send({ comments });
    })
    .catch(next);
};

exports.sendArticles = (req, res, next) => {
  const { sort_by: sortBy, order, author, topic, limit, p: page } = req.query;

  const models = [
    getArticles(sortBy, order, author, topic, limit, page),
    countArticles(),
  ];
  if (author) models.push(getUserByUsername(author));
  if (topic) models.push(getTopicBySlug(topic));

  Promise.all(models)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];
      const total_count = resolvedPromises[1];
      res.send({ total_count, articles });
    })
    .catch(next);
};
