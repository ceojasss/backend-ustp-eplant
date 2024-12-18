const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",pocode "pocode",to_char(podate,'dd-mm-yyyy') "podate",suppliercode "suppliercode",remarks "remarks",authorized "authorized",
delivered "delivered",transportationcost "transportationcost",customclearancecost "customclearancecost",othercost "othercost",
currency "currency",topcode "topcode",deliveryinstruction "deliveryinstruction",franco "franco",purchasing_site "purchasing_site",
payment_address "payment_address",to_char(required_date,'dd-mm-yyyy') "required_date",process_flag "process_flag",inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from lpo where pocode like '%POT%'
and (deliveryinstruction LIKE  UPPER('%' || :search ||'%') OR remarks LIKE  UPPER('%' || :search ||'%'))
  and to_char(podate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(podate,'mmyyyy')) ORDER BY podate DESC
`

/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid",
tid "tid",pocode "pocode",itemcode "itemcode",quantity "quantity",amount "amount",
unitprice "unitprice",itemdescription "itemdescription",UOM "UOM",statusppn "statusppn",polineno "polineno",inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from lpodetails where pocode like '%POT%'
and pocode=:pocode `



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
