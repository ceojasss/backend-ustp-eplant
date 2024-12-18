const HandlerDB = require('./DatabaseHandler')
const _ = require("lodash")


async function get(req, res, next) {
  await HandlerDB.fetchData(req.user, _.split(req.baseUrl,'/')[3], req.query, (error, result) => {
      if (error) {
          return next(error)
      }
      res.send(result);

  })
}


module.exports.get = get
  