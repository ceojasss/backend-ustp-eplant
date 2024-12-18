const HandlerDB = require('./DatabaseHandler')
const _ = require('lodash')
const {sendResult, insertdataHandler, UpdateResult,updatedataHandler,deleteDataHandler} = require('../../../../util/HelperUtility')
const dbhandler = require('../../../../oradb/dbHandler')
const dbCrudHandler = require('../../../../oradb/dbCrudHandler')
const table = 'LEGAL_EXT_REPORT_DATA'
const oracledb = require('oracledb');

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

        /* const re_result = UpdateResult(result)


        res.send({
            ...result,
            data: re_result,
            count: ((_.isUndefined(result['data']) || _.isEmpty(result['data'])) ? 0 : result['data'][0]['total_rows'])
        }) */



    })

}

module.exports.get =get;

async function getDetail(req, res, next) {


    await HandlerDB.fetchDataDetail(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


        if (error) {
            return next(error)
        }

        const re_result = UpdateResult(result)

        res.send(re_result)

    })

}
module.exports.getDetail =getDetail;


async function put(req, res, next) {


    const stmt = req
    const binds = req
    let table = 'LEGAL_EXT_REPORT_DATA'
    let rows
    let errors
    let retval
    let process = []

    const { data, formComps } = req.body

    dbConnection = dbhandler.getdbCreds(req.user.site)
    conn = await oracledb.getConnection(dbConnection);


    const detailtoinsert = Object.values({ ...data[0].inserts })
    const detailtoupdate = Object.values({ ...data[0].updates })
    const detailtodelete = Object.values({ ...data[0].deletes })


    //const formCompMaster = _.filter(formComps, x => _.keys(detailtoinsert).includes(x.key))

    console.log(detailtoupdate)

    if (!_.isEmpty(detailtoinsert)) {
        process.push(dbCrudHandler.createDetail(conn, detailtoinsert, formComps, req.user, table));
    }


    if (!_.isEmpty(detailtoupdate)) {
        process.push(dbCrudHandler.updateDetail(conn, detailtoupdate, formComps, req.user, table));
    }

    if (!_.isEmpty(detailtodelete)) {
        process.push(dbCrudHandler.deleteDetail(conn, detailtodelete, formComps, req.user, table));
    }

    await Promise.all(process).then((returnvalues) => {


        retval = { returnvalues }

        conn.commit(() => { conn.close() })

    }).catch(error => {
        conn.rollback(() => { conn.close() });

        //    console.log('errors', error.message)
        retval = { error: error.message }
        //throw new Error(error)
    })

    res.status(200).json(retval)

}

module.exports.put =put;
