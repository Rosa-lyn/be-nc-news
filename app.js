const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  handleInvalidPaths,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./errors");

app.use("/api", apiRouter);
app.all("/*", handleInvalidPaths);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);

module.exports = app;
