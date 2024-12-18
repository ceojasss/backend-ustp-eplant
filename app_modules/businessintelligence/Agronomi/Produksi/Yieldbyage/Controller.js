const query = require("./DatabaseHandler");
const router = require("express").Router();

const _ = require("lodash")

async function get(req, res, next) {
  await query.fetchData(req.user, _.split(req.baseUrl,'/')[3], req.query, (error, result) => {
      if (error) {
          return next(error)
      }
      res.send(result);

  })
}


module.exports = {
  get
}

  



