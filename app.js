const express = require("express");
const app = express();
const cors = require("cors");
const apiRouter = require("./routes/api-router");
const {
  handleInvalidPaths,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./errors");

var whitelist = ["http://localhost:3000", "https://thenewsden.netlify.app"];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api", apiRouter);
app.all("/*", handleInvalidPaths);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);

module.exports = app;
