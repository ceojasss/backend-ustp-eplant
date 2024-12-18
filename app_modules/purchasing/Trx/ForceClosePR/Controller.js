const HandlerDB = require('./DatabaseHandler')
const _ = require('lodash')
const {sendResult, insertdataHandler, UpdateResult} = require('../../../../util/HelperUtility')

const table = 'FORCECLOSEPR'

async function get(req, res, next) {


    await HandlerDB.fetchData(req.user, req.query, req.route.path.replace("/", ""), (error, result) => {


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

async function getDetail(req, res, next) {


    await HandlerDB.fetchDataDetail(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


        if (error) {
            return next(error)
        }

        const re_result = UpdateResult(result)

        res.send(re_result)

    })

}

module.exports = {
    get, post, getDetail
}

