const HandlerDB = require('./DatabaseHandler')
const _ = require('lodash')
const { UpdateResult, insertdataHandler, updatedataHandler, deleteDataHandler } = require('../../../../util/HelperUtility')
const table = 'mom'
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

async function getUniq(req, res, next) {


    await HandlerDB.getUniq(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


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

module.exports.getUniq = getUniq;

async function post(req, res, next) {

    await insertdataHandler(table, req, res)


}

module.exports.post = post;

async function update(req, res, next) {
    await updatedataHandler(table, req, res)
}

module.exports.update = update;

async function hapus(req, res, next) {
    await deleteDataHandler(table, req, res);
}

module.exports.hapus = hapus;
