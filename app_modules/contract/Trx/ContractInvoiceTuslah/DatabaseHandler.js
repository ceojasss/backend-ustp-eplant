const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid" ,invoicecode "invoicecode", to_char(invoicedate,'dd-mm-yyyy') "invoicedate", 
contractorcode||' '||get_contractorname (contractorcode) "contractorcode", paid "paid", remarks "remarks", 
faktur "faktur", faktur_pajak "faktur_pajak", agreementcode "agreementcode", invoice_amount "invoice_amount", 
inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from contract_invoice_ctl
  where (invoicecode LIKE  UPPER('%' || :search ||'%') OR invoicedate LIKE  UPPER('%' || :search ||'%')) 
  and to_char(invoicedate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(invoicedate,'mmyyyy')) ORDER BY invoicedate DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid" ,
tid "tid", invoicecode "invoicecode", quantity "quantity", amount "amount", 
agreementcode "agreementcode", progressno "progressno", vatcode "vatcode", incometax "incometax", jamsostek "jamsostek", 
agreementlineno "agreementlineno",  inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from contract_invoicedetail_ctl
where invoicecode= :invoicecode`



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

module.exports = {
    fetchDataHeader,
    fetchDataDetail
}
