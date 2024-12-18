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
 const _ = require('lodash');
 const { insertdataHandler, UpdateResult, deleteDataHandler, updatedataHandler, sendResult } = require('../../../../util/HelperUtility');
 const HandlerDB = require('./DatabaseHandler');
const { createmasterdetail, insertupdatemasterdetail } = require('../../../../oradb/dbCrudHandler');
 
 
 const table = ["WORKORDERHEADER"];
 

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

module.exports.get = get;



async function post(req, res, next) {
    const stmt = req;
    const binds = req;


    let rows;
    let errors;

    const document = 'WORKORDER'

    try {
        await createmasterdetail(table, document, req.user, req.body, binds)
            .then((result) => {

                if (result.error) {
                    errors = result;
                } else {
                    rows = result;
                }
            })
            .catch((error) => {
                console.log('error --> ', error, '<---')
                res.status(200).json({ error: error.message, detail: error.stack });
            });



        res.status(200).json(rows);
    } catch (error) {
        console.log(error)
        res.status(200).json({ data: [] });
    }
}

module.exports.post = post;


async function update(req, res, next) {

    try {

        await insertupdatemasterdetail(table, req.user, req.body, binds)
            .then((v) => res.status(200).json(v))
            .catch((e) => res.status(200).json({ error: e.stack }))


    } catch (error) {

        res.status(200).json({ data: [], errormessage: error.message });
    }

}

module.exports.update = update;

async function hapus(req, res, next) {
    await deleteDataHandler(table, req, res);
}

module.exports.hapus = hapus;
 
 module.exports = {
   hapus, get, post, update
 }
 
 