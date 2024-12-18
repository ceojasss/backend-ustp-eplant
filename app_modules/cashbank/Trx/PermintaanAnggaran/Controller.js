/*=============================================================================
 |       Author:  IT - USTP
 |         Team:  - Gunadi Rismananda
 |                - Muhammad Ghaza
 |                -
 |                -
 |
 |  Description:  Handling API ROUTE Untuk Module Permintaan Anggaran
 |
 | Dependencies:  express     --> webserver framework 
 |                body-parser --> parsing semua request http menjadi JSON
 |                passport    --> library authentication untuk login. (Login menggunakan JWT)
 |                
 |
 *===========================================================================*/

const _ = require('lodash')
const binf_db = require('./DatabaseHandler')
const dbhandler = require('../../../../oradb/dbHandler')
const { UpdateResult, insertdataHandler, updatedataHandler, deleteDataHandler, sendResult } = require('../../../../util/HelperUtility')

const table = 'permintaan_anggaran'

async function get(req, res, next) {
    await binf_db.fetchData(req.user, req.route.path.replace("/", ""), (error, result) => {
        if (error) {
            return next(error)
        }
        sendResult(result, res)

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
