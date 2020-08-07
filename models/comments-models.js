const knex = require("../db/connection");
const { request } = require("express");

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

exports.deleteCommentByCommentId = (commentId) => {
  return knex("comments").del().where("comment_id", commentId);
};

exports.getCommentByCommentId = (commentId) => {
  return knex
    .select("*")
    .from("comments")
    .where("comment_id", commentId)
    .then((commentRows) => {
      if (commentRows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found :(",
        });
      } else return commentRows[0];
    });
};
