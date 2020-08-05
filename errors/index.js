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
    let id = req.url.substring(14);
    id = id.replace(/%20/g, " ");

    if (req.body.inc_votes && typeof req.body.inc_votes !== "number") {
      res.status(400).send({
        msg: "Invalid request body :( inc_votes value must be a number",
      });
    } else {
      res.status(400).send({
        msg: `Invalid article id: ${id} :( Article id must be a number`,
      });
    }
  } else console.log(err);
};
