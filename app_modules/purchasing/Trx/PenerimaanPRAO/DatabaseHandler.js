const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",companyid "companyid",prcode "prcode",to_char(prdate, 'dd-mm-yyyy') "prdate",prpriority "prpriority",prrequestfrom "prrequestfrom",
prnotes "prnotes",to_char(submit_date, 'dd-mm-yyyy') "submit_date",to_char(receive_by_proc, 'dd-mm-yyyy') "receive_by_proc",return_by_proc "return_by_proc",receive_from_rtn "receive_from_rtn",
to_char(receive_vencom, 'dd-mm-yyyy') "receive_vencom",inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from LPR_SUBMIT_TO_AO_MST
where (prcode LIKE  UPPER('%' || :search ||'%') OR companyid LIKE  UPPER('%' || :search ||'%'))
  and to_char(submit_date,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(submit_date,'mmyyyy')) ORDER BY submit_date DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` SELECT  a.rowid "rowid",
tid "tid",to_char(prdate, 'dd-mm-yyyy') "prdate",A.REMARKS "remarks",A.PRCODE "prcode",PRNOTES "prnotes",ITEMCODE "itemcode",ITEMDESCRIPTION "itemdescription",
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
