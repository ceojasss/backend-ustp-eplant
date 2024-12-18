const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `
select rowid "rowid" ,INVOICECODE "invoicecode", to_char(invoicedate,'dd-mm-yyyy') "invoicedate", 
AGREEMENTCODE "agreementcode", CONTRACTORCODE||' '||get_contractorname (CONTRACTORCODE) "contractorcode", 
FAKTUR "faktur",FAKTUR_PAJAK "faktur_pajak",netbalance"netbalance",remarks"remarks",
inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from contract_invoice 
where 
(invoicedate LIKE  UPPER('%' || :search ||'%') OR contractorcode LIKE  UPPER('%' || :search ||'%') OR invoicecode LIKE  UPPER('%' || :search ||'%'))
and to_char(INVOICEDATE,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(INVOICEDATE,'mmyyyy')) ORDER BY INVOICEDATE DESC
`
/**
   * ! change query table detail
   */
const detailQuery = ` select tid"tid", rowid "rowid" , 
tid "tid",INVOICECODE "invoicecode", QUANTITY "quantity", AMOUNT "amount",
AGREEMENTCODE "agreement", PROGRESSNO "progressno", VATCODE "vatcode", INCOMETAX "incometax", tid "tid",
 JAMSOSTEK "jamsostek", AGREEMENTLINENO "agreementlineno", inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  from contract_invoicedetail
where invoicecode= :invoicecode
`

const QueryDataLink = `  select distinct documentno"progressno",
to_char(wipdate,'dd-mm-yyyy') "date",agreementcode "agreementcode"
 from workinprogress where agreementcode=:agreementcode order by documentno desc`

const QueryDataLinkDetails = `SELECT   a.documentno"progressno", a.tid "tid",
a.agreementlineno"agreementlineno",
DECODE (b.DPTYPE,
        2, 0,
        0, ( ( (NVL (a.qty, 0) - NVL (w.qty, 0)) * NVL (a.RATE, 0)) * NVL (b.DOWNPAYMENT, 0)) / 100,
        (NVL (b.DOWNPAYMENT, 0) * NVL (a.rate, 0)) / 100)
   "dp",
a.ppn"vatcode",
a.pph"incometax",
NVL (a.jamsostek, 0) "jamsostek",
NVL (a.qty, 0) - NVL (w.qty, 0) "quantity",
( (NVL (a.qty, 0) - NVL (w.qty, 0)) * NVL (a.rate, 0)) "amount"
FROM   workinprogress A, contractagreement b, workinprogress_edit w
WHERE       a.agreementcode = :agreementcode
AND a.documentno = :documentno
AND a.AGREEMENTCODE = b.AGREEMENTCODE
AND a.agreementcode = w.agreementcode(+)
AND a.documentno = w.documentno(+)
AND a.agreementlineno = w.agreementlineno(+)
ORDER BY   a.documentno`



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
    binds.invoicecode = (!params.invoicecode ? '' : params.invoicecode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

const fetchDataLinkHeader = async function (users, routes, params, callback) {

    binds = {}


    /**
     * ! change the parameters according to the table
     */
    // binds.vouchercode = (!params.vouchercode ? '' : params.vouchercode)
    // binds.approvedate = (!params.approvedate ? '' : params.approvedate)
    binds.agreementcode = (!params.agreementcode ? '' : params.agreementcode)

    let result


    try {
        result = await database.siteWithDefExecute(users, routes, QueryDataLink, binds)

    } catch (error) {
        callback(error, '')
    }
    // }



    callback('', result)
}

const fetchDataLinkDetails = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */



    binds.documentno = (!params.code ? '' : params.code)
    binds.agreementcode = (!params.agreementcode ? '' : params.agreementcode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, QueryDataLinkDetails, binds)

    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}




    
module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    fetchDataLinkHeader,
    fetchDataLinkDetails
}
