const {
  patchCommentByCommentId,
  deleteCommentByCommentId,
  getCommentByCommentId,
} = require("../models/comments-models");

exports.updateCommentByCommentId = (req, res, next) => {
  const { comment_id: commentId } = req.params;
  const { inc_votes: incVotes } = req.body;
  patchCommentByCommentId(commentId, incVotes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.removeCommentByCommentId = (req, res, next) => {
  const { comment_id: commentId } = req.params;

  const models = [getCommentByCommentId(commentId)];
  if (commentId) models.push(deleteCommentByCommentId(commentId));

  Promise.all(models)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
