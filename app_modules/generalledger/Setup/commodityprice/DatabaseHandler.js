const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery =`select 
rowid "rowid",
PRODUCTCODE "productcode", 
LOCATION "location", 
to_char(TDATE,'dd-mm-yyyy') "tdate",
to_char(DELIVERYDATE,'dd-mm-yyyy') "deliverydate",
CURRENCY "currency",
PRICE "price",
inputby"inputby",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
vat "vat"
from commodityprice 
where 
PRODUCTCODE LIKE  UPPER('%' || :search ||'%') and
TO_CHAR (TDATE, 'mmyyyy') = decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
TO_CHAR (TDATE, 'mmyyyy')) 
ORDER BY PRODUCTCODE DESC
`



/**
   * ! change query table detail
   */
const detailQuery = `select 
rowid "rowid",
tid "tid",
PRODUCTCODE "productcode", 
LOCATION "location", 
to_char(TDATE,'dd-mm-yyyy') "tdate",
to_char(DELIVERYDATE,'dd-mm-yyyy') "deliverydate",
CURRENCY "currency",
PRICE "price",
inputby"inputby",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
vat "vat"
from commodityprice 
where 
productcode = :productcode
`


const requestData = `select 
rowid "rowid",
PRODUCTCODE "productcode", 
LOCATION "location", 
to_char(TDATE,'dd-mm-yyyy') "tdate",
to_char(DELIVERYDATE,'dd-mm-yyyy') "deliverydate",
CURRENCY "currency",
PRICE "price",
inputby"inputby",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
vat "vat"
from commodityprice 
where 
PRODUCTCODE LIKE  UPPER('%' || :search ||'%') and
TO_CHAR (TDATE, 'mmyyyy') = decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
TO_CHAR (TDATE, 'mmyyyy')) 
ORDER BY PRODUCTCODE DESC
`


const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        console.log('result : ',result)
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
    binds.productcode = (!params.productcode ? '' : params.productcode)

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



    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

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

