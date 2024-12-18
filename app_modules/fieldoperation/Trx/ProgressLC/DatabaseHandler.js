const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",blockid "blockid",description "description" from blockmaster where
(blockid LIKE  UPPER('%' || :search ||'%') OR description LIKE  UPPER('%' || :search ||'%') )
`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid "rowid",blockid "blockid",
tid "tid", luas "luas", luas_diselesaikan "luas_diselesaikan", to_char(date_closed, 'dd-mm-yyyy') "date_closed",total_cost "total_cost",status "status",inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from lcfinalheader 
where 
blockid=:blockid and 
to_char(date_closed,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(date_closed,'mmyyyy')) ORDER BY date_closed`



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
    binds.blockid = (!params.blockid ? '' : params.blockid)
    binds.period = (!params.period ? '' : params.period)
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
