const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid" ,writeoffcode "writeoffcode", to_char(wodate,'dd-mm-yyyy') "wodate", remarks "remarks", storecode "storecode", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from writeoffvoucher 
  where (writeoffcode LIKE  UPPER('%' || :search ||'%') OR storecode LIKE  UPPER('%' || :search ||'%') )
  and to_char(wodate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(wodate,'mmyyyy')) ORDER BY wodate DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid" ,
tid "tid",writeoffcode "writeoffcode", itemcode||' - '||get_purchaseitemname(itemcode) "itemcode", 
locationtypecode "locationtypecode", locationcode "locationcode", quantity "quantity", karung "karung", remarks "remarks", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
from writeoffdetails

where writeoffcode= :writeoffcode`



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
    binds.writeoffcode = (!params.writeoffcode ? '' : params.writeoffcode)

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







