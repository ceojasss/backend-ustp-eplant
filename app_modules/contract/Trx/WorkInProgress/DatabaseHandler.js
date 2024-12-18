const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",agreementcode "agreementcode",to_char(wipdate,'dd-mm-yyyy')  "wipdate",agreementlineno "agreementlineno",qty "qty",postedflag "postedflag",
pph "pph",ppn "ppn",documentno "documentno",description "description",
jamsostek "jamsostek",currid "currid",rate "rate",paid "paid",deleted_flag "deleted_flag",
status_sync "amount_cap",inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  from WORKINPROGRESS
  where (agreementcode LIKE  UPPER('%' || :search ||'%') OR description LIKE  UPPER('%' || :search ||'%')) 
  and to_char(wipdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(wipdate,'mmyyyy')) ORDER BY wipdate DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` SELECT b.rowid "rowid",
tid "tid",B.AGREEMENTCODE "agreementcode",to_char(agreementdate,'dd-mm-yyyy') "agreementdate",REQUESTNO "requestno",A.DESCRIPTION "description",CONTRACTORCODE "contractorcode",C.DESCRIPTION "contractorname",B.LOCATIONTYPE "locationtype",B.LOCATIONCODE "locationcode",
to_char(duedate,'dd-mm-yyyy') "duedate",B.QTY "volume",UOM "uom",B.RATE "unitprice", AMOUNT "amount",PPHCODE "pphcode",PPNCODE "ppncode",  DOCUMENTNO "progressno",D.QTY "wipqty",to_char(wipdate,'dd-mm-yyyy') "wipdate" FROM CONTRACTAGREEMENT A, AGREEMENTDETAIL B,LOCATION C, WORKINPROGRESS D 
WHERE A.AGREEMENTCODE=B.AGREEMENTCODE AND CONTRACTORCODE=C.LOCATIONCODE 
AND A.AGREEMENTCODE=D.AGREEMENTCODE
AND B.AGREEMENTCODE=:AGREEMENTCODE`



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
    binds.agreementcode = (!params.agreementcode ? '' : params.agreementcode)

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

