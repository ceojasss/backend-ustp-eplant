const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT DISTINCT  v.rowid "rowid",
v.vehiclecode                     "vehiclecode",
v.description                     "description",
v.vehiclegroupcode                "vehiclegroupcode",
a.process_flag                  "process_flag",
g.description                     "group_description",
TO_CHAR (a.vehdate, 'mmyyyy')     "period" 
FROM vehicle v, vehicleactivity a, vehiclegroup g, masterperencanaanintrans m
WHERE     v.vehiclecode = a.vehiclecode
AND v.vehiclegroupcode = g.vehiclegroupcode
AND v.vehiclecode = m.vehiclecode
AND to_char(VEHDATE,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(VEHDATE,'mmyyyy'))
AND inactivedate IS NULL
AND (   v.vehiclecode LIKE '%' || :search || '%'
OR v.description LIKE '%' || :search || '%'
OR v.vehiclegroupcode LIKE '%' || :search || '%'
OR a.updateby LIKE '%' || :search || '%'
OR a.inputby LIKE '%' || :search || '%'
OR g.description LIKE '%' || :search || '%')
ORDER BY v.vehiclecode`

/**
 * ! change query table detail
 */
const detailQuery = `select distinct m.ROWID "rowid",m.TID "tid", TO_CHAR (m.TDATE, 'dd-mm-yyyy') "tdate", 
m.VEHICLECODE "vehiclecode",
m.LOCATIONTYPE "locationtype#code", 
get_locationdesc(m.LOCATIONTYPE) "locationtype#description",
m.LOCATIONCODE "locationcode#code",
getloc_des(m.LOCATIONCODE) "locationcode#description",m.JOBCODE "jobcode#code",getjob_des(m.JOBCODE) "jobcode#description",
m.INPUTBY "inputby", to_char(m.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
TO_CHAR (va.vehdate, 'mmyyyy')     "period" 
FROM masterperencanaanintrans m, vehicleactivity va WHERE m.vehiclecode = :vehiclecode 
AND TO_CHAR (va.VEHDATE, 'mmyyyy') =
NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'),
   TO_CHAR (va.VEHDATE, 'mmyyyy'))`



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
    binds.vehiclecode = (!params.vehiclecode ? '' : params.vehiclecode)
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


