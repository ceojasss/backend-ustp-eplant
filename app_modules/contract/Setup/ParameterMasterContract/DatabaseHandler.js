const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid"rowid",parametercode "parametercode", parametername "parametername", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from parameter where upper(controlsystem) = 'CTR' and (parametercode like '%'||:search ||'%') order by parametercode`

/**
   * ! change query table detail
   */
const detailQuery = `SELECT 
rowid "rowid" ,
tid "tid",
parametercode "parametercode",
parametervaluecode "parametervaluecode",
parametervalue "parametervalue",
inputby   "inputby",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
updateby  "updateby",
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
uom "uom"
 FROM parametervalue
where parametercode = :parametercode`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        // console.log(result)
    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}
const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */
    binds.parametercode = (!params.parametercode ? '' : params.parametercode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)



    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail
}


