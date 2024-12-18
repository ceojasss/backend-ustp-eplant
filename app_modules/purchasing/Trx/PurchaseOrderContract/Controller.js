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
 
 const { insertdataHandler, deleteDataHandler, updatedataHandler, sendResult, UpdateResult } = require('../../../../util/HelperUtility')
 
 const table = 'lpocontract'
 
 async function get(req, res, next) {


    await HandlerDB.fetchDataHeader(req.user, req.query, req.route.path.replace("/", ""), (error, result) => {


        if (error) {
            return next(error)
        }
        // if(_.isUndefined(result['data'])||_.isEmpty(result['data'])){
        //     res.send({
        //         
        //         ...result,
        //         count: 0
        //     })
        // } else {
        //     // result['data'][0]['total_rows']
        //     res.send({
        //         
        //         ...result,
        //         count: result['data'][0]['total_rows']
        //     })
        // }
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
     await insertdataHandler(table, req, res)
 }
 
 async function update(req, res, next) {
     await updatedataHandler(table, req, res)

    //  console.log(_.get(_.get(req.body.data[0],'header'),'process_flag1'))
    // if(_.get(_.get(req.body.data[0],'header'),'process_flag1') === 'APPROVED'){

    //      const rows = await HandlerDB.runApprove(req.user,req.body);
    //     console.log(rows)
    //     if (rows) {
    //         res.status(200).json({
    //             // data: rows
    //         });
    //     } else {
    //         res.status(200).json({ data: [] });
    //     }
    // }
 }
 
 async function hapus(req, res, next) {
     await deleteDataHandler(table, req, res);
 }
 async function postapp(req, res, next) {


    const rows = await HandlerDB.runApprove(req.user, req.body);

    if (rows) {
        res.status(200).json({
            data: rows
        });
    } else {
        res.status(200).json({ data: [] });
    }

}


 module.exports = {
     hapus, get, post, update,postapp
 }