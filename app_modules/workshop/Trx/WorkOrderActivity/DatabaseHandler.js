const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT DISTINCT  v.rowid "rowid",
v.workorderno                     "workordernodisplayonly#code",
v.workorderno                     "workorderno#code",
v.workorderno                     "workorderno_code",
v.keluhan                     "keluhan",
v.REQESTEDBYDEPT "reqestedbydept",
TO_CHAR (a.tdate, 'dd-mm-yyyy')     "tdate" 
FROM workorderheader v, Workorderdetailactivity a
WHERE     v.workorderno = a.workorderno
AND to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy'))
AND (   v.workorderno LIKE '%' || :search || '%'
OR v.keluhan LIKE '%' || :search || '%'
OR v.REQESTEDBYDEPT LIKE '%' || :search || '%')
ORDER BY v.workorderno`

/**
 * ! change query table detail
 */
const detailQuery = `select rowid "rowid",workorderno"workorderno_code",workorderno "workorderno#code",descriptions "descriptions",mic "mic#code",get_empname(mic)"mic#description",TO_CHAR (tdate, 'dd-mm-yyyy')"tdate", tid "tid",
TO_CHAR (jamawal, 'hh24:mi') "jamawal",TO_CHAR (jamakhir, 'hh24:mi') "jamakhir",inputby "inputby",to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from Workorderdetailactivity
where workorderno = :workorderno 
and to_char(tdate,'ddmmyyyy') = nvl(to_char(TO_DATE(:tdate, 'DD/MM/YYYY'),'ddmmyyyy'),to_char(tdate,'ddmmyyyy'))
AND to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) order by workorderno
`


const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

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
    binds.workorderno = (!params.workorderno ? '' : params.workorderno)
    binds.period = (!params.period ? '' : params.period)
    binds.tdate = (!params.tdate ? '' : params.tdate)

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

