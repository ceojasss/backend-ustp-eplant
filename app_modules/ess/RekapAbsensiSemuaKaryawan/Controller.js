/*=============================================================================
 |       Author:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                -
 |                -
 |                -
 |
 |  Description:  Handling API ROUTE Untuk Module CashBank
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/


const _ = require('lodash')
const HandlerDB = require('./DatabaseHandler')



async function get(req, res, next) {

    await HandlerDB.fetchData(req.user, req.query, req.route.path.replace("/", ""), (error, result) => {
        if (error) {
            return next(error)
        }
        res.send(result);
    })
}

module.exports.get = get;

