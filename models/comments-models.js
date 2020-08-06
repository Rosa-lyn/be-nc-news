const knex = require("../db/connection");

exports.patchCommentByCommentId = (commentId, incVotes) => {
  if (incVotes === undefined) incVotes = 0;
  return knex("comments")
    .increment("votes", incVotes)
    .where("comment_id", commentId)
    .returning("*")
    .then((commentRows) => {
      if (commentRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found :(",
        });
      } else return commentRows[0];
    });
};
