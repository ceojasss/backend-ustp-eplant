
const _ = require('lodash')

const HandlerDB = require('./DatabaseHandler')
const CrudhandlerDB = require('../../../../oradb/dbCrudHandler')


const { UpdateResult } = require('../../../../util/HelperUtility')

const table = ['MR', 'MRDETAILS']

async function get(req, res, next) {
    let resultset

    await HandlerDB.fetchDataHeader(req.user, req.query, req.route.path.replace("/", ""), (error, result) => {


        if (error) {
            return next(error)
        }

        //    console.log(result)


        /* if (result?.data)
            return res.send('empty')
 */
        const re_result = UpdateResult(result)

        res.send({
            ...result,
            data: re_result,
            count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
        })

        /* res.send({
            ...resultset,
            data: re_result,
            count: ((_.isUndefined(resultset['data']) || _.isEmpty(resultset['data'])) ? 0 : resultset['data'][0]['total_rows'])
        })
 */    })

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



async function getEMDEK(req, res, next) {


    await HandlerDB.CheckEmdek(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


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

module.exports.getEMDEK = getEMDEK;


async function post(req, res, next) {
    const stmt = req;
    const binds = req;


    let rows;
    let errors;

    //   console.log(req)

    //  const table = ['JOURNALVOUCHER', 'JVDETAILS']

    const document = 'MATERIAL REQUEST'

    try {
        await CrudhandlerDB.createmasterdetail(table, document, req.user, req.body, binds)
            .then((result) => {
                //   console.log(req.body)

                if (result.error) {
                    errors = result;
                    // res.status(500).json(errors)
                } else {
                    rows = result;
                }
            })
            .catch((error) => {
                //console.log('error kita', error.message)

                //            errors = error
                console.log('error --> ', error, '<---')
                res.status(200).json({ error: error.message, detail: error.stack });
            });

        //console.log(`return -> ${ context.user}`)

        //console.log(`not null -> ${rows} , ${JSON.stringify(rows[0])}`)
        //console.log('error', errors)

        //        res.send(errors)

        res.status(200).json(rows);
    } catch (error) {
        console.log(error)
        res.status(200).json({ data: [] });
    }
}

module.exports.post = post;

async function put(req, res, next) {

    const stmt = req, binds = req

    let rows, errors, httpstatus, retval;


    try {

        await CrudhandlerDB.insertupdatemasterdetail(table, req.user, req.body, binds)
            .then((v) => res.status(200).json(v))
            .catch((e) => res.status(200).json({ error: e.stack }))


    } catch (error) {

        //console.log('error', JSON.parse(error))

        //   console.log('masuk sini')
        res.status(200).json({ data: [], errormessage: error.message });
    }




}

module.exports.put = put