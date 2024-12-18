const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select referencenumber "referencenumber",groupid "groupid", fixedassetcode "fixedassetcode", seq "seq", to_char(referencedate,'dd-mm-yyyy') "referencedate",
to_char(effectivedate,'dd-mm-yyyy') "effectivedate", disposereason "disposereason", disposemethod "disposemethod", technicalengcomment "technicalengcomment", estsalvagevalue "estsalvagevalue", 
purchasecomment "purchasecomment", estsalevalue "estsalevalue", financecomment "financecomment", financesuggest "financesuggest", disposeqty "disposeqty",
inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from fadisposal
where (fixedassetcode LIKE  UPPER('%' || :search ||'%') OR disposereason LIKE UPPER('%' || :search ||'%'))
and to_char(referencedate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(referencedate,'mmyyyy')) ORDER BY referencedate DESC`



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


module.exports = {
    fetchDataHeader
}


