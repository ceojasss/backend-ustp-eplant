const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const querySource = `select GROUPLABEL "grouplabel",
   GROUPID"groupid",
    CODE "code", 
    ROUTE "route"
    , BINDS "binds", 
   COLUMN_LIST "column_list", 
   RETURNTYPE "returntype",
    QUERY_STATEMENT "query_statement",
    pre_statement "pre_statement"
from wizardqueries
where route = :route
ORDER BY to_number(CODE) `

const querylist = `select parametervalue "reportdesc" ,parametervaluecode "registryid" ,
mod_code "reportname",controlsystem "param#p_org"
from parametervalue v
where ( (parametercode = 'RPM0099' and 'costbook'=:route) 
or (parametercode = 'RPM0095' and 'kebun'=:route) 
or (parametercode = 'RPM0094' and 'plasma'=:route) 
or (parametercode = 'RPM0093' and 'legal'=:route) 
or (parametercode = 'RPM0096' and 'quarter'=:route) 
or (parametercode = 'RPM0097' and 'budget'=:route) 
)
order by seq_no`

const fetchData = async function (req, callback) {
    let error, fillStatement

    let result = []

    const find = req.query
    const users = req.user



    const routes = req.params['0'];//req.route.path.replace("/", "")


    let bindsFills = _.pick(find, ['p_date'])

    fillStatement = `begin PKG_RPT_BOD_DAILY.GENERATE_fix ( To_date(:P_DATE,'dd-mm-yyyy')); end;`


    let bindSource = { route: routes }

    let fetch = []

    console.log('run ')


    try {

        let result = await database.fetchFromTempDataWithComp(users, routes, fillStatement, querySource, bindsFills, find, bindSource)

        let comp = await database.getFormComponent(users, routes, opts = {})


        fetch = {
            data: result,
            component: comp
        }

    } catch (errors) {

        error = errors
    }




    callback(error, fetch)
}

const fetchList = async function (req, callback) {
    let error, result

    const users = req.user
    const route = req.baseUrl.split("/")[3]//req.params['0'];//req.route.path.replace("/", "")

    const find = req.query

    console.log(find)

    console.log('route', req.baseUrl.split("/")[3])

    try {
        result = await database.siteWithDefExecute(users, route, querylist, find)



    } catch (errors) {

        error = errors
    }




    callback(error, result)
}

module.exports = {
    fetchData, fetchList
}