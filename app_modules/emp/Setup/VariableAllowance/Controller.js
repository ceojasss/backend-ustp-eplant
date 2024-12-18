const HandlerDB = require('./DatabaseHandler')
const _ = require('lodash')
const { UpdateResult, insertdataHandler, updatedataHandler, deleteDataHandler, sendResult } = require('../../../../util/HelperUtility')

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
        sendResult(result, res)

    })

}

async function getDetail(req, res, next) {


    await HandlerDB.fetchDataDetail(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


        if (error) {
            return next(error)
        }

        const re_result = UpdateResult(result)


        res.send(
            // 
            re_result
            // count: (!_.isEmpty(result) ? result['data'][0]['total_rows'] : 0)
        )

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
    hapus, get, post, update, getDetail
}