const commentsRouter = require("express").Router();
const {
  updateCommentByCommentId,
  removeCommentByCommentId,
} = require("../controllers/comments-controllers");
const { handleInvalidMethods } = require("../errors");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentByCommentId)
  .delete(removeCommentByCommentId)
  .all(handleInvalidMethods);

module.exports = commentsRouter;
