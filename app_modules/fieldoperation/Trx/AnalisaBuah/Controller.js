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
const { UpdateResult, sendResult, insertdataHandler, updatedataHandler, deleteDataHandler } = require('../../../../util/HelperUtility')
const HandlerDB = require('./DatabaseHandler')
const table = 'analisabuah'

async function get(req, res, next) {


    await HandlerDB.fetchDataHeader(req.user, req.query, req.route.path.replace("/", ""), (error, result) => {

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