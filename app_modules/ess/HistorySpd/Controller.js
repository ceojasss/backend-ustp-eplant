const HandlerDB = require("./DatabaseHandler");
const _ = require("lodash");

async function get(req, res, next) {
  await HandlerDB.fetchDataHeader(req.user, req.query, req.route.path.replace("/", ""),(error, result) => {
      if (error) {
        return next(error);
      }

      res.send({query: req.query,...result, count:_.isUndefined(result["data"]) || _.isEmpty(result["data"])? 0 : result["data"][0]["total_rows"],});
    }
  );
}

module.exports.get = get;