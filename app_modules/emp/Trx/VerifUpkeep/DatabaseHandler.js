const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT DISTINCT  --v.rowid "rowid",
v.gangcode                     "gangcode",
v.description                     "description",
a.inputby ||' - '|| get_empname(a.inputby) ||' - '|| get_empposname(a.inputby) "inputby"
FROM gang v, masterrawatedit a
WHERE     v.gangcode = a.gangcode
and gangtype='R'
AND to_char(tdate,'ddmmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'DD/MM/YYYY'),'ddmmyyyy'),to_char(tdate,'ddmmyyyy'))
AND (   v.gangcode LIKE  upper ('%' || :search || '%')
OR v.description LIKE ('%' || :search || '%')
OR v.inputby LIKE upper ('%' || :search || '%'))
ORDER BY v.gangcode`

/**
 * ! change query table detail
 */
const detailQuery = `  select a.rowid "rowid"/*,tid "tid"*/,checkmandor "checkmandor", checkkerani "checkkerani",checkmandor "checkmandor_t", checkkerani "checkkerani_t",to_char(tdate,'dd-mm-yyyy') "tdate",gangcode "gangcode",mandorecode "mandorecode#code", get_empname(mandorecode) "mandorecode#description",empcode "empcode#code", get_empname(empcode) "empcode#description",jobcode "jobcode#code",getjob_des(jobcode) "jobcode#description",
LOCATIONTYPE "locationtype#code",NVL (get_locationdesc (locationtype), 'NA') "locationtype#description",LOCATIONCODE "locationcode#code",NVL (getloc_des (locationcode), 'NA') "locationcode#description",unit "unit",mandays "mandays", keterangan "keterangan",a.inputby "inputby#code",get_empname(a.inputby) "inputby#description"
,a.updateby "updateby", to_char(a.updatedate,'dd-mm-yyyy hh24:mi') "updatedate", verified1 "verified1", verified2 "verified2",to_char(verifieddate1,'dd-mm-yyyy') "verifieddate1", to_char(verifieddate2,'dd-mm-yyyy') "verifieddate2" from MASTERRAWATEDIT a where  
to_char(tdate,'ddmmyyyy') = nvl(to_char(TO_DATE(:period, 'DD/MM/YYYY'),'ddmmyyyy'),to_char(tdate,'ddmmyyyy'))
and   GANGCODE=:gangcode
order by tdate`



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
    binds.gangcode = (!params.gangcode ? '' : params.gangcode)
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


