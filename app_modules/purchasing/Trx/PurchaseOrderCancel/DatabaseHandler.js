const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
 const baseQuery = `select rowid "rowid",pocode "pocode", to_char(podate, 'dd-mm-yyyy hh24:mi') "podate",
 suppliercode "suppliercode",remarks "remarks",currency "currency",topcode "topcode", 
 deliveryinstruction "deliveryinstruction",franco "franco",purchasing_site "purchasing_site",
 payment_address "payment_address",inputby "inputby",to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
 updateby "updateby",to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"  from lpocanceled
 where (pocode LIKE '%' || :search ||'%' OR remarks LIKE '%' || :search ||'%')
   and to_char(podate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),
   to_char(podate,'mmyyyy')) ORDER BY podate DESC`
 
/**
   * ! change query table detail
   */
 const detailQuery = ` select rowid "rowid",pocode "pocode",itemcode "itemcode",
 quantity "quantity",itemdescription "itemdescription",
 UOM "uom",polineno "polineno",
 to_char(canceleddate, 'dd-mm-yyyy') "canceleddate",inputby "inputby",to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
 updateby "updateby",to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from lpocanceleddetails
 where pocode = :pocode `
 



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
    binds.pocode = (!params.pocode ? '' : params.pocode)

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


