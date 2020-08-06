const { patchCommentByCommentId } = require("../models/comments-models");

exports.updateCommentByCommentId = (req, res, next) => {
  const { comment_id: commentId } = req.params;
  const { inc_votes: incVotes } = req.body;
  patchCommentByCommentId(commentId, incVotes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
