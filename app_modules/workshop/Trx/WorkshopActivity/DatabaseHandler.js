const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT DISTINCT  v.rowid "rowid",
v.workshopcode                     "workshopcode",
v.description                     "description",
CASE
WHEN SUM (CASE WHEN A.TID IS NOT NULL THEN 0 ELSE 1 END) OVER (partition by v.workshopcode,to_char(dateactivity,'mmyyyy')) <>
0
THEN
'CLOSED'
ELSE
a.process_flag
END                                        "process_flag",
TO_CHAR (a.dateactivity, 'mmyyyy')     "period" 
FROM workshop v, Workshopactivity a
WHERE     v.workshopcode = a.workshopcode
AND to_char(dateactivity,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(dateactivity,'mmyyyy'))
AND (   v.workshopcode LIKE '%' || :search || '%'
OR a.updateby LIKE '%' || :search || '%'
OR a.inputby LIKE '%' || :search || '%'
OR v.description LIKE '%' || :search || '%')
ORDER BY v.workshopcode`

/**
 * ! change query table detail
 */
const detailQuery = `select rowid "rowid",
tid "tid",workshopcode "workshopcode",
TO_CHAR (dateactivity, 'dd-mm-yyyy') "dateactivity",
TO_CHAR (time, 'hh24:mi')             "time",
locationtype "locationtype#code",
get_locationdesc (locationtype)            "locationtype#description",
location "location#code",
getloccode_des (locationtype,location)                  "location#description",
job  "job#code",
getjob_des (job)     "job#description",hours "hours",amount "amount",workorderno "workorderno",
mechanic "mechanic",description "description",inputby "inputby",to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"   from Workshopactivity
WHERE     workshopcode = :workshopcode
AND TO_CHAR (dateactivity, 'mmyyyy') = b    
    NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'),
         TO_CHAR (dateactivity, 'mmyyyy'))
ORDER BY workshopcode,dateactivity,location`


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
    binds.workshopcode = (!params.workshopcode ? '' : params.workshopcode)
    binds.period = (!params.period ? '' : params.period)

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

