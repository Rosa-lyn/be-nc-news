const commentsRouter = require("express").Router();
const {
  updateCommentByCommentId,
  removeCommentByCommentId,
} = require("../controllers/comments-controllers");

commentsRouter
  .route("/:comment_id")
  .patch(updateCommentByCommentId)
  .delete(removeCommentByCommentId);

module.exports = commentsRouter;
