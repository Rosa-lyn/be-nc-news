const usersRouter = require("express").Router();
const { sendUserByUsername } = require("../controllers/users-controllers");
const { handleInvalidMethods } = require("../errors");

usersRouter
  .route("/:username")
  .get(sendUserByUsername)
  .post(handleInvalidMethods);

module.exports = usersRouter;
