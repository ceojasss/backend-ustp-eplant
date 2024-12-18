const HandlerDB = require("./DatabaseHandler");
const _ = require("lodash");

async function get(req, res, next) {
  await HandlerDB.fetchDataHeader(
    req.user,
    req.query,
    req.route.path.replace("/", ""),
    (error, result) => {
      if (error) {
        return next(error);
      }

      res.send({
        query: req.query,
        ...result,
        count:
          _.isUndefined(result["data"]) || _.isEmpty(result["data"])
            ? 0
            : result["data"][0]["total_rows"],
      });
    }
  );
}

module.exports.get = get;

async function getDetail(req, res, next) {
  await HandlerDB.fetchDataDetail(
    req.user,
    req.route.path.replace("/", ""),
    req.query,
    (error, result) => {
      if (error) {
        return next(error);
      }

      res.send(
        // query: req.query,
        result
        // count: (!_.isEmpty(result) ? result['data'][0]['total_rows'] : 0)
      );
    }
  );
}

module.exports.getDetail = getDetail;
