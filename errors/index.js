exports.handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "Path not found :(" });
};

exports.handleInvalidMethods = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed :(" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({
      msg: "Invalid id :(",
    });
  } else if (err.code === "42703") {
    res.status(400).send({
      msg: "Invalid sort query :(",
    });
  } else console.log(err);
};
