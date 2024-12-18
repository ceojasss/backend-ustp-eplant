const _ = require('lodash')
const database = require('../../../../oradb/dbHandler');
const OracleDB = require('oracledb');

const queryStatement = `SELECT module, referenceno, tanggal, locationtype, jobcode, description,
MONTH, YEAR
FROM temp_validasi_transaksi
WHERE MONTH = :P_MONTH AND YEAR = :P_YEAR AND module = NVL (:P_MODUL, module)`


const querySource = `select GROUPLABEL "grouplabel",   GROUPID"groupid", CODE "code", ROUTE "route" , 
BINDS "binds", COLUMN_LIST "column_list", RETURNTYPE "returntype", QUERY_STATEMENT "query_statement",
pre_statement "pre_statement",pre_statement_bind "pre_statement_bind"
from wizardqueries
where route = lower(:route)
ORDER BY CODE `


const fetchDataDynamic = async function (users, find, callback) {

    let result, error, fillStatement

    fillStatement = `begin P_VALIDASITRANSAKSI ( :P_MODUL, :P_MONTH, :P_YEAR, :P_STATUS ); end;`

    let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_MODUL', 'P_STATUS'])

    _.assignIn(bindsFills, { P_STATUS: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER } })


    let bindStatement = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_MODUL'])


    try {
        result = await database.fetchFromTempData(users, fillStatement, queryStatement, bindsFills, bindStatement)

    } catch (errors) {

        error = errors
    }


    callback(error, result)
}


const fetchData = async function (req, callback) {
    let error, fillStatement

    let result = []

    const find = req.query
    const users = req.user


    const routes = req.params['0'];

    let bindSource = { route: routes }
    let fetch



    try {

        fetch = await database.fetchFromTempDataWithComp(users, routes, null, querySource, null, find, bindSource)


    } catch (errors) {
        console.log(errors)
        error = errors
    }


    //console.log(fetch[0].content.rows)

    callback(error, fetch)
}


module.exports = {
    fetchDataDynamic,
    fetchData
}
