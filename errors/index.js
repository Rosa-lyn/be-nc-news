exports.handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "Path not found :(" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ msg: err.msg });
};
