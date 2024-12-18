const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",prcode "prcode",to_char(tdate, 'dd-mm-yyyy') "tdate",reason "reason",inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy') "updatedate"
,status "status" from FORCECLOSEPR
where (prcode LIKE  UPPER('%' || :search ||'%') OR reason LIKE  UPPER('%' || :search ||'%'))
  and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) ORDER BY tdate DESC`

/**
 * ! change query table detail
 */
const detailQuery = `SELECT  a.rowid "rowid",
tid "tid",to_char(PRDATE,'dd-mm-yyyy') "prdate",A.REMARKS "remarks",A.PRCODE "prcode",PRNOTES "prnotes",ITEMCODE "itemcode",ITEMDESCRIPTION "itemdescription",
QUANTITY "quantity",UOMCODE "uomcode" FROM LPRDETAILS A, LPR B WHERE A.PRCODE=B.PRCODE and a.prcode=:prcode`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

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
    binds.prcode = (!params.prcode ? '' : params.prcode)

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
