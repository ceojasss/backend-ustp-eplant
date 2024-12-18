const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
 const baseQuery = `select 
 rowid "rowid", 
 parametercode "parametercode",
 description "description",
 paramtype "paramtype",
 alldedcode "alldedcode",
 comp_id "comp_id",
 site_id "site_id",
 inputby "inputby",
 to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
 updateby "updateby", 
 to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
 from PARAMETERPAYROLL
 where (parametercode LIKE  UPPER('%' || :search ||'%') 
 OR description LIKE  UPPER('%' || :search ||'%'))
 ORDER BY parametercode DESC`
 
 /**
    * ! change query table detail
    */
 const detailQuery = ` select 
 rowid "rowid", 
 tid "tid",
 parametercode "parametercode",
 emptype "emptype",
 attdtype "attdtype",
 attdcode "attdcode",
 rate "rate",
 jobcode "jobcode",
 comp_id "comp_id",
 site_id "site_id",
 inputby "inputby",
 to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
 updateby "updateby", 
 to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
 from PARAMETERPAYROLLATTD
 where parametercode= :parametercode`



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
