const express = require("express");
const app = express();
const cors = require("cors");
const apiRouter = require("./routes/api-router");
const {
  handleInvalidPaths,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./errors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);
app.all("/*", handleInvalidPaths);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);

module.exports = app;
