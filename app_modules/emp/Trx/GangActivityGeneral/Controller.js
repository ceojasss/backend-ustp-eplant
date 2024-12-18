const _ = require('lodash')

const dbhandler = require('../../../../oradb/dbHandler')
const dbCrudHandler = require('../../../../oradb/dbCrudHandler')
const { UpdateResult } = require('../../../../util/HelperUtility')
const HandlerDB = require('./DatabaseHandler')
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


    })

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


async function post(req, res, next) {

    const stmt = req
    const binds = req
    let table = 'gangactivity'
    let rows
    let errors
    let retval
    let process = []

    const { data, formComps } = req.body

    dbConnection = dbhandler.getdbCreds(req.user.site)
    conn = await oracledb.getConnection(dbConnection);


    const detailtoinsert = Object.values({ ...data[0].inserts })

    //const formCompMaster = _.filter(formComps, x => _.keys(detailtoinsert).includes(x.key))

    // console.log(detailtoinsert)

    if (!_.isEmpty(detailtoinsert)) {

        process.push(dbCrudHandler.createDetail(conn, detailtoinsert, formComps, req.user, table));

        await Promise.all(process).then((returnvalues) => {

            //        console.log(returnvalues)

            retval = { returnvalues }

            conn.commit(() => { conn.close() })

        }).catch(error => {
            conn.rollback(() => { conn.close() });

            retval = { error: error.message }
            //throw new Error(error)
        })
    }

    res.status(200).json(retval)

    /*  try {

         await dbhandler.insertdatas(table, req.user, req.body, binds).then(result => {

             if (result.error) {
                 errors = result
             } else {
                 rows = result
             }

         }).catch(error => {
             res.status(200).json({ 'error': error.message, 'detail': error.stack })
         });



         res.status(200).json(rows)

     } catch (error) {
         res.status(200).json({ data: [], errormessage: error.message });
     } */

}

module.exports.post = post


async function put(req, res, next) {


    const stmt = req
    const binds = req
    let table = 'gangactivity'
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

module.exports.put = put