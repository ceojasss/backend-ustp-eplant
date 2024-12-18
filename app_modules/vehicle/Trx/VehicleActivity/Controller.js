const _ = require('lodash')

const dbhandler = require('../../../../oradb/dbHandler')
const dbCrudHandler = require('../../../../oradb/dbCrudHandler')
const { UpdateResult, parseStringToDate } = require('../../../../util/HelperUtility')
const HandlerDB = require('./DatabaseHandler')
const oracledb = require('oracledb');
const { INSERT, UPDATE } = require('../../../../util/Constants')

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


async function getDetail(req, res, next) {


    await HandlerDB.fetchDataDetail(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


        if (error) {
            return next(error)
        }

        const re_result = UpdateResult(result)

        res.send(re_result)

    })

}



async function getDetailLimit(req, res, next) {

    let checkEntry

    await HandlerDB.fetchCount(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {

        if (error) {
            res.send({})
        }

        checkEntry = result

        //res.send(result)

    })

    const last_date = _.maxBy(checkEntry.rows, function (o) { return o.vehdate_date.getDate() })

    const dateList = _.map(checkEntry.rows, function (o) { return o.vehdate })

    let binds = { ...req.query }

    //    console.log('periods', last_date)

    if (checkEntry?.rows[0]?.entries > 99) {

        _.set(binds, 'periodone', last_date.vehdate)
        _.set(binds, 'periodtwo', last_date.vehdate)

        await HandlerDB.fetchDataDetailByDate(req.user, req.route.path.replace("/", ""), binds, (error, result) => {


            if (error) {
                return next(error)
            }

            const re_result = UpdateResult(result)

            res.send({ data: re_result, datefilter: dateList })

        })



    } else {
        await HandlerDB.fetchDataDetail(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


            if (error) {
                return next(error)
            }

            const re_result = UpdateResult(result)

            //res.send(re_result)

            res.send({ data: re_result })

        })

    }



}

/* 
    await HandlerDB.fetchDataDetail(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {
 
 
        if (error) {
            return next(error)
        }
 
        const re_result = UpdateResult(result)
 
        res.send(re_result)
 
    })
} */



async function getDetailByDate(req, res, next) {


    await HandlerDB.fetchDataDetailByDate(req.user, req.route.path.replace("/", ""), req.query, (error, result) => {


        if (error) {
            return next(error)
        }

        const re_result = UpdateResult(result)

        res.send(re_result)

    })

}
async function post(req, res, next) {

    const stmt = req
    const binds = req
    let table = 'vehicleactivity'
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

    console.log(retval)

    res.status(200).json(retval)

}



async function put(req, res, next) {


    const stmt = req
    const binds = req
    let table = 'vehicleactivity'
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
        process.push(dbCrudHandler.createDetail(conn, detailtoinsert, formComps, req.user, table, INSERT));
    }


    if (!_.isEmpty(detailtoupdate)) {
        process.push(dbCrudHandler.updateDetail(conn, detailtoupdate, formComps, req.user, table, UPDATE));
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



async function hapus(req, res, next) {
    const stmt = req
    const binds = req
    let table = 'vehicleactivity'
    let rows
    let errors
    let retval
    let process = []

    const { data, formComps } = req.body

    dbConnection = dbhandler.getdbCreds(req.user.site)
    conn = await oracledb.getConnection(dbConnection);


    const detailtodelete = Object.values({ ...data[0].delete })

    //const formCompMaster = _.filter(formComps, x => _.keys(detailtoinsert).includes(x.key))

    // console.log(detailtodelete)

    if (!_.isEmpty(detailtodelete)) {

        process.push(dbCrudHandler.deleteDetail(conn, detailtodelete, formComps, req.user, table));

        await Promise.all(process).then((returnvalues) => {

            retval = { returnvalues }
            // console.log(retval)
            conn.commit(() => { conn.close() })

        }).catch(error => {
            conn.rollback(() => { conn.close() });

            retval = { error: error.message }
        })
    }

    res.status(200).json()
}
async function Updatemavh(req, res, next) {



    const rows = await HandlerDB.update_avail_mavh(req.user, req.body);

    if (rows) {
        res.status(200).json({
            data: rows
        });
    } else {
        res.status(200).json({ data: [] });
    }

}
/* module.exports.hapus = hapus
module.exports.get = get
module.exports.getDetail = getDetail
module.exports.post = post
module.exports.put = put
module.exports.getDetailEdit = getDetailEdit
 */
module.exports = {
    hapus,
    get,
    post,
    put,
    getDetail,
    getDetailLimit,
    getDetailByDate,
    Updatemavh
}
