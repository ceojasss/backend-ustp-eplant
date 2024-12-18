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

const stsg_db = require('./DatabaseHandler')
const _ = require('lodash')
const { UpdateResult, insertdataHandler, updatedataHandler, deleteDataHandler } = require('../../../../util/HelperUtility')

const table = 'bbc_percentage'
async function get(req, res, next) {
    await stsg_db.fetchdata(req.user, req.route.path.replace("/", ""), (error, result) => {
        if (error) {
            return next(error)
        }
        const re_result = UpdateResult(result)

        res.send({
            ...result,
            data: re_result,
            count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
        })
    })
}

async function post(req, res, next) {
    await insertdataHandler(table, req, res)
}

async function update(req, res, next) {
    await updatedataHandler(table, req, res)
}

async function hapus(req, res, next) {
    await deleteDataHandler(table, req, res);
}

module.exports = {
    hapus, get, post, update
}