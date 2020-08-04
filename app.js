const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const { handleInvalidPaths } = require("./errors");

app.use("/api", apiRouter);
app.all("/*", handleInvalidPaths);

module.exports = app;
