const commentsRouter = require("express").Router();
const {
  updateCommentByCommentId,
} = require("../controllers/comments-controllers");

commentsRouter.route("/:comment_id").patch(updateCommentByCommentId);

module.exports = commentsRouter;
