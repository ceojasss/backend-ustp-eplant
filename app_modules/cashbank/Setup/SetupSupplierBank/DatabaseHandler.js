const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `select DISTINCT SUPPLIERCODE "suppliercode", get_suppliername(SUPPLIERCODE) "suppliername",
v_url_preview_site (
    'SUPB',
    CASE
        WHEN suppliercode IS NULL THEN 'DRAFT'
        ELSE 'APPROVED'
    END)
|| suppliercode "v_url_preview"
from supplier  where (SUPPLIERCODE like '%'||:search ||'%' or get_suppliername(SUPPLIERCODE) like upper ('%'||:search ||'%')) and inactivedate is null  order by suppliercode`



const detailQuery = `select ROWID "rowid",  SUPPLIERCODE "suppliercode", BANKNAME "bankname", BANKACCNO "bankaccno", ACCNONAME "accnoname",tid "tid", 
CURRENCY "currency", ADDRESS "address",
inputby "inputby",
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
from supplierbank where suppliercode=:suppliercode order by bankname`

const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    // binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result


    //console.log(binds.search, binds.dateperiode)
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


