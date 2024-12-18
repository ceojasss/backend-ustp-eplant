const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT DISTINCT  h.rowid "rowid",
h.id_spd  "id_spd",
w.no_spd  "no_spd",
h.empcode "empcode",
h.empname "empname",
to_char(h.date_arr, 'dd-mm-yyyy') "date_arr",
to_char(h.date_dep,'dd-mm-yyyy') "date_dep",
destination "destination"
--w.tdate  "tdate",
FROM epms_ustp.hr_dec_spd_header h, epms_ustp.hr_dec_spd_work w
WHERE     h.no_spd = w.no_spd
AND (   h.no_spd LIKE '%' || :search || '%')
ORDER BY w.no_spd`

/**
 * ! change query table detail
 */
const detailQuery = `select 
rowid "rowid",
tid "tid", 
no_spd  "no_spd",
to_char(tdate,'dd-mm-yyyy') "tdate", 
remarks  "remarks", 
dayoff  "dayoff", 
inputby "inputby", 
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby",
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
from hr_dec_spd_work where 
no_spd = :no_spd
`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}

    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    
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
    binds.no_spd = (!params.no_spd ? '' : params.no_spd)

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



