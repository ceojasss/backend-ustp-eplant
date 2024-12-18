const HandlerDB = require('./DatabaseHandler')


async function get(req, res, next) {
  await HandlerDB.fetchData(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {
      if (error) {
          return next(error)
      }
      res.send(result);

  })
}


module.exports.get = get
  