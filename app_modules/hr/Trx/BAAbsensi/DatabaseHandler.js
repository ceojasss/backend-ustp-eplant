const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  e.empcode "empcode", e.empname "empname",employeetype "employeetype",e.rowid "rowid",description "jabatan",to_char(datejoin,'dd-mm-yyyy') "datejoin",to_char(dateterminate,'dd-mm-yyyy')  "dateterminate"
from empmasterepms e,mas_position p where e.id_position= p.code  and (e.empcode like '%'||:search ||'%' or e.empname like '%'||:search ||'%')  order by e.empcode`

/**
   * ! change query table detail
   */
const detailQuery = `SELECT empcode "empcode", 
tid "tid",
to_char(tdate,'dd-mm-yyyy') "tdate",
reason "reason", 
attdcode "attcode",
valid "valid", 
inputby "inputby", 
updateby "updateby", 
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
 to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" 
 from EMP_BA_ABSENT where empcode = :empcode`



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
    binds.empcode = (!params.empcode ? '' : params.empcode)

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
