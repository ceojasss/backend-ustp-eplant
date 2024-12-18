const HandlerDB = require('./DatabaseHandler')
const _ = require('lodash')
const {sendResult, insertdataHandler, UpdateResult,updatedataHandler,deleteDataHandler} = require('../../../../util/HelperUtility')

const table = 'OPTPHMASTER'

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

module.exports.get =get;

async function post(req, res, next) {

    await insertdataHandler(table, req, res)
}
module.exports.post=post;

async function getDetail(req, res, next) {


    await HandlerDB.fetchDataDetail(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


        if (error) {
            return next(error)
        }

        const re_result = UpdateResult(result)

        res.send(re_result)

    })

}

module.exports.getDetail = getDetail;

async function update(req, res, next) {
    await updatedataHandler(table, req, res)
}

module.exports.update = update;

async function hapus(req, res, next) {
    await deleteDataHandler(table, req, res);
}

module.exports.hapus = hapus;