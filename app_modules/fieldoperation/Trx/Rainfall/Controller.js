const HandlerDB = require('./DatabaseHandler')
const _ = require('lodash')
const { UpdateResult } = require('../../../../util/HelperUtility')

async function get(req, res, next) {

    let vReturn = '', vError = ''

    await HandlerDB.fetchDataHeader(req.user, req.query, req.route.path.replace("/", ""), (error, result) => {


        if (error) {
            //console.log('next', error)
            //return next(error)
            vError = error


        } else {
            vReturn = result
        }
    })



    if (vError !== '') {
        res.send({
            vError
        })
    }
    else {
        // console.log('return', vReturn)

        res.send({
            ...vReturn,
            data: UpdateResult(vReturn),
            count: ((_.isUndefined(vReturn['data']) || _.isEmpty(vReturn['data'])) ? 0 : vReturn['data'][0]['total_rows'])
        })
    }
}

module.exports.get = get;

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

module.exports.getDetail = getDetail;
