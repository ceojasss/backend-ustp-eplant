const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `select DISTINCT contractorcode "contractorcode", get_contractorname(contractorcode) "contractorname",
v_url_preview_site (
    'CONB',
    CASE
        WHEN contractorcode IS NULL THEN 'DRAFT'
        ELSE 'APPROVED'
    END)
|| contractorcode "v_url_preview"
from contractor  where (contractorcode like '%'||:search ||'%' or  get_contractorname(contractorcode) like upper ('%'||:search ||'%')) and inactivedate is null  order by contractorcode`



const detailQuery = `select ROWID "rowid",  contractorcode "contractorcode", BANKNAME "bankname", BANKACCNO "bankaccno", ACCNONAME "accnoname",tid "tid", 
CURRENCY "currency", ADDRESS "address",
inputby "inputby",
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
from contractorbank where contractorcode=:contractorcode order by bankname`

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
    binds.contractorcode = (!params.contractorcode ? '' : params.contractorcode)

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


