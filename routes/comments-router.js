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
  .post(handleInvalidMethods);

module.exports = commentsRouter;
