const HandlerDB = require('./DatabaseHandler')

const _ = require("lodash")


async function get(req, res, next) {
  // console.log(_.split(req.baseUrl,'/'))
  await HandlerDB.fetchData(req.user, req.query, _.split(req.baseUrl,'/')[3], (error, result) => {
      if (error) {
          return next(error)
      }
      // const re_result = UpdateResult(result)
      res.send(
        result
      );

  })
}


module.exports.get = get
  