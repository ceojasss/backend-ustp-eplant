const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const querySource = `SELECT GROUPLABEL                 "grouplabel",
GROUPID                    "groupid",
CODE                       "code",
ROUTE                      "route",
BINDS                      "binds",
COLUMN_LIST                "column_list",
RETURNTYPE                 "returntype",
QUERY_STATEMENT            "query_statement",
pre_statement              "pre_statement",
pre_statement_bind         "pre_statement_bind",
childroute                 "childroute"
FROM reportbuilder
WHERE registryid = :route
ORDER BY CODE`

const querySourceSingle = `select GROUPLABEL "grouplabel",   GROUPID"groupid", CODE  "code", ROUTE "route" ,
 BINDS "binds", COLUMN_LIST "column_list", RETURNTYPE "returntype", QUERY_STATEMENT "query_statement"
,pre_statement "pre_statement",pre_statement_bind  "pre_statement_bind", childroute "childroute"
FROM reportbuilder
WHERE registryid = :route ` //and code = :p_code 8/ `

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

        //        console.log('return ', result)


        fetch = {
            data: result,
            component: comp
        }

    } catch (errors) {

        error = errors
    }




    callback(error, fetch)
}


const singeleFetch = async function (req, callback) {
    let error, fillStatement

    let result = []

    const find = req.query
    const users = req.user

    const routes = req.params['0'];//req.route.path.replace("/", "")


    let bindsFills = _.pick(find, ['p_date'])
    let bindSource = { route: routes, ..._.pick(find, ['p_code']) }

    // console.log('source', bindSource)

    let fetch = []


    try {

        let result = await database.fetchFromTempDataToXLS(users, routes, fillStatement, querySourceSingle, bindsFills, find, bindSource)

        fetch = { data: result }            //      component: comp}

    } catch (errors) {

        console.log('singeleFetch call', errors.message)

        error = errors.message
    }


    callback(error, fetch)
}



module.exports = {
    fetchData,
    singeleFetch
}