const HandlerDb = require ("./DatabaseHandler");
const router = require("express").Router();

async function get(req, res, next) {
    await HandlerDb.fetchData(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {
        if (error) {
            return next(error)
        }
        res.send(result);
  
    })
  }
  
  
  module.exports = {
    get
  }