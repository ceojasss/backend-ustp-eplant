const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",invoicecode "invoicecode",to_char(invoicedate, 'dd-mm-yyyy') "invoicedate",suppliercode "suppliercode",remarks "remarks",
termofpayment "termofpayment",reference "reference",totalamount "totalamount",currcode "currcode",inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from invoicewopoheader
where (invoicecode LIKE  UPPER('%' || :search ||'%') OR remarks LIKE  UPPER('%' || :search ||'%'))
  and to_char(invoicedate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(invoicedate,'mmyyyy')) ORDER BY invoicedate DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid",
tid "tid",invoicecode "invoicecode",itemcode "itemcode",quantity "quantity",amount "amount",
vatcode "vatcode",incometax "incometax",jobcode "jobcode",targetcode "targetcode",targettype "targettype",itemdescription "itemdescription",description "description",unitprice "unitprice",
inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"  from invoicewopodetail
where invoicecode = :invoicecode`



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
