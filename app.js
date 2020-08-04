const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const { handleInvalidPaths, handleCustomErrors } = require("./errors");

app.use("/api", apiRouter);
app.all("/*", handleInvalidPaths);

app.use(handleCustomErrors);

module.exports = app;
