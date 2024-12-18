// const dbagro = require("./DatabaseHandler");
// const router = require("express").Router();
// const { sendResult } = require('../../../../util/HelperUtility')




// async function get(req, res, next) {
//   console.log('CONTROLLER')
//   await dbagro.fetchTables(req.query, (error, result) => {
//       if (error) {
//           // return next(error)
//           console.log(error , 'err')

//       }
//       sendResult(result, res)
//       // res.send(result);

//       console.log('hasil Controller' , result)

//   })
// }

// module.exports = {get}

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
