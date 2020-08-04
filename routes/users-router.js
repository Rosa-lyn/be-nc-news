const usersRouter = require("express").Router();
const { sendUserByUsername } = require("../controllers/users-controllers");

usersRouter.use("/:username", sendUserByUsername);

module.exports = usersRouter;
