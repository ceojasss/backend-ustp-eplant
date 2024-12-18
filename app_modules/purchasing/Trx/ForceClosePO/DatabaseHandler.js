const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid", pocode "pocode", to_char(tdate,'dd-mm-yyyy') "tdate", 
reason "reason",inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  
from forceclosepo where (pocode LIKE  UPPER('%' || :search ||'%')) 
and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),
to_char(tdate,'mmyyyy')) order by pocode
`

/**
 * ! change query table detail
 */
const detailQuery = `select rowid "rowid", tid "tid", pocode "pocode", remarks "remarks",
to_char(podate, 'dd-mm-yyyy') "podate" FROM lpo where pocode = :pocode 
and to_char(podate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(podate,'mmyyyy')) order by pocode`



const fetchData = async function (users, params, routes, callback) {

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
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}


module.exports = {
    fetchData, fetchDataDetail
}


