exports.handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "Path not found :(" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    const id = req.url.substring(14);
    res.status(400).send({ msg: `Invalid article id: ${id} :(` });
  } else console.log(err);
};
