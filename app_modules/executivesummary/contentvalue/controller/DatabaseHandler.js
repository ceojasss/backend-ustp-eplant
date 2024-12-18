const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')
const oracledb = require('oracledb');


const querySource = `select GROUPLABEL "grouplabel",   GROUPID"groupid", CODE "code", ROUTE "route" ,
 BINDS "binds", COLUMN_LIST "column_list", RETURNTYPE "returntype", QUERY_STATEMENT "query_statement"
,pre_statement "pre_statement",pre_statement_bind  "pre_statement_bind", childroute "childroute" ,hasfilter "hasfilter"
from wizardqueries
where route = :route
ORDER BY CODE  `

const querySourceSingle = `select GROUPLABEL "grouplabel",   GROUPID"groupid", CODE  "code", ROUTE "route" ,
 BINDS "binds", COLUMN_LIST "column_list", RETURNTYPE "returntype", QUERY_STATEMENT "query_statement"
,pre_statement "pre_statement",pre_statement_bind  "pre_statement_bind", childroute "childroute",hasfilter "hasfilter"
from wizardqueries
where route = :route and code = :p_code `

const queryBase = `select QUERY_STATEMENT "query_statement"
from wizardqueries
where route = :route `

const fetchData = async function (req, callback) {
    let error, fillStatement

    let result = [], routescomp

    const find = req.query
    const users = req.user

    const routes = req.params['0'];//req.route.path.replace("/", "")


    let bindsFills = _.pick(find, ['p_date'])
    let bindSource = { route: routes }

    let fetch = []


    /** if parameter has p_route then it used as route to get component  */
    if (!_.isNil(_.pick(find, ['p_route']))) {
        routescomp = _.pick(find, ['p_route']).p_route;
    } else {
        routescomp = req.params['0'];
    }

    try {



        let result = await database.fetchFromTempDataWithComp(users, routes, fillStatement, querySource, bindsFills, find, bindSource)

        let comp = await database.getFormComponent(users, routescomp, opts = {})


        fetch = {
            data: result,
            component: comp
        }

    } catch (errors) {

        error = errors
    }




    callback(error, fetch)
}



const fetchClobData = async function (req, callback) {
    let error, fillStatement

    let result = [], routescomp

    const find = req.query
    const users = req.user

    const routes = req.params['0'];//req.route.path.replace("/", "")


    let bindsFills = _.pick(find, ['p_date'])


    let fetch = []


    /** if parameter has p_route then it used as route to get component  */
    if (!_.isNil(_.pick(find, ['p_route']))) {
        routescomp = _.pick(find, ['p_route']).p_route;
    } else {
        routescomp = req.params['0'];
    }

    let bindSource = { route: routescomp }

    try {

        let result = await database.fetchDataFromClob(users, queryBase, bindSource)

        fetch = { data: result }

    } catch (errors) {

        error = errors
    }




    callback(error, fetch)
}

const fetchStmt = async function (req, stmt, callback) {
    let error

    // console.log('data', stmt)

    let conn;
    let dbConnection;

    opts = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
        extendedMetaData: true,               // get extra metadata
    }



    //  console.log(req.user)

    dbConnection = database.getdbCreds(req.user.site)

    try {

        conn = await oracledb.getConnection(dbConnection);


        const data = await Promise.all(_.map(stmt, async function (x, y) {


            let xstats = `${x.query_statement}`
            let bindst = {}//{ [x.binds]: '' }

            //            console.log('query', x)
            //            console.log('param', req.query)

            const fetchTemplate = await conn.execute(xstats, bindst, opts)

            //          console.log('DATA', fetchTemplate)

            return { 'group': x, ...fetchTemplate }

        }))

        callback(error, data)
    }

    catch (err) {
        console.log('fetchStmt fetchDataFromClob handler error', err)
        callback(err, null)
    } finally {
        if (conn) { // conn assignment worked, need to close
            try {
                console.log('close connection')

                await conn.close()
            } catch (err) {
                // console.log('DB error',err)
            }
        }
    }
}



const singeleFetch = async function (req, callback) {
    let error, fillStatement

    let result = []

    const find = req.query
    const users = req.user

    const routes = req.params['0'];//req.route.path.replace("/", "")


    let bindsFills = _.pick(find, ['p_date'])
    let bindSource = { route: routes, ..._.pick(find, ['p_code']) }

    // console.log(routes)

    let fetch = []


    try {

        let result = await database.fetchFromTempDataWithComp(users, routes, fillStatement, querySourceSingle, bindsFills, find, bindSource)

        //    let comp = await database.getFormComponent(users, routes, opts = {})

        fetch = {
            data: result,
            //      component: comp
        }

    } catch (errors) {

        error = errors
    }




    callback(error, fetch)
}



module.exports = {
    fetchData,
    singeleFetch,
    fetchClobData,
    fetchStmt
}