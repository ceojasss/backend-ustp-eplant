const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT suppliercode "suppliercode#code", TO_CHAR(tdate, 'dd-mm-yyyy') "tdate", catatan "catatan", rekomendasi "rekomendasi", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mm') "inputdate"
, updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mm') "updatedate" from supplier_evaluation_hdr where (suppliercode LIKE UPPER ('%' || :search || '%')
AND  TO_CHAR (tdate, 'mmyyyy') =
decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'))) order by suppliercode desc`


/**
   * ! change query table detail
   */
const detailQuery = `SELECT rowid "rowid",suppliercode "suppliercode",tid "tid", '4' "maxdisplayonly",TO_CHAR(tdate, 'dd-mm-yyyy') "tdate", param "param", tvalue "tvalue", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mm') "inputdate",
updateby "updateby",to_char(updatedate, 'dd-mm-yyyy hh24:mm') "updatedate"
from  supplier_evaluation_dtl where suppliercode = :suppliercode 
and to_char(tdate,'ddmmyyyy') = nvl(to_char(TO_DATE(:tdate, 'DD-MM-YYYY'),'ddmmyyyy'),to_char(tdate,'ddmmyyyy')) order by suppliercode desc`

const requestData = `select parametervaluecode ||' ' ||parametervalue "param" from PARAMETERVALUE where parametercode = 'PUREVAL' order by parametervaluecode`

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
    binds.suppliercode = (!params.suppliercode ? '' : params.suppliercode)
    binds.tdate = (!params.tdate ? '' : params.tdate)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

const fetchDataLinkDetails = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */



    // binds.progressdate = (!params.progressdate ? '' : params.progressdate)
    // binds.progressno = (!params.progressno ? '' : params.progressno)
    // binds.agreementcode = (!params.agreementcode ? '' : params.agreementcode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, requestData, binds)

    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    fetchDataLinkDetails
}






