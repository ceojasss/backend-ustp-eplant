const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT DISTINCT  --v.rowid "rowid",
v.vehiclecode                     "vehiclecode",
v.description                     "description",
--v.vehiclegroupcode                "vehiclegroupcode",
--CASE
--WHEN SUM (CASE WHEN A.TID IS NOT NULL THEN 0 ELSE 1 END) OVER (partition by v.vehiclecode,to_char(VEHDATE,'mmyyyy')) <>
--0
--THEN
--'CLOSED'
--ELSE
--a.process_flag
--END                                        "process_flag",
--g.description                     "group_description",
substr(tanggal,1,2) || substr(tanggal,3,2) || substr(tanggal,5,4)   "period",
a.inputby ||' - '|| get_empname(a.inputby) ||' - '|| get_empposname(a.inputby) "inputby"
FROM vehicle v, masterhasilintrans a, vehiclegroup g
WHERE     v.vehiclecode = a.gangcode
AND v.vehiclegroupcode = g.vehiclegroupcode
AND substr(tanggal,1,2) ||'/'|| substr(tanggal,3,2) ||'/'|| substr(tanggal,5,4) = :dateperiode
AND inactivedate IS NULL
AND (   v.vehiclecode LIKE  upper ('%' || :search || '%')
OR v.description LIKE upper ('%' || :search || '%')
OR v.vehiclegroupcode LIKE upper ('%' || :search || '%')
OR g.description LIKE upper ('%' || :search || '%'))
ORDER BY v.vehiclecode`

/**
 * ! change query table detail
 */
const detailQuery = `  select a.rowid "rowid",tid "tid", vehiclegroupcode "vehiclegroupcodedisplayonly",checkmandor "checkmandor", checkkerani "checkkerani",checkmandor "checkmandor_t", checkkerani "checkkerani_t",tanggal "tanggal",KM_AWAL "km_awal",KM_AKHIR "km_akhir",jobdescription "jobdescription",loadtypecodedesc "loadtypecodedesc",TO_char(date_awal,'hh24:mi') "date_awal",TO_CHAR(date_akhir,'hh24:mi') "date_akhir",jobcode "jobcode#code",getjob_des(jobcode) "jobcode#description",gangcode "vehiclecode",
LOCATIONTYPE "locationtype#code",NVL (get_locationdesc (locationtype), 'NA') "locationtype#description",LOCATIONCODE "locationcode#code",NVL (getloc_des (locationcode), 'NA') "locationcode#description",LOCATIONCODE_ORIGINAL "locationcode_original#code",NVL (getloc_des (locationcode), 'NA') "locationcode_original#desc",PRESTASI "prestasi",LOADTYPECODE "loadtypecode",UNITOFMEASURECODE "unitofmeasurecode",range "range",categorytransport "categorytransport#code",range "categorytransport#description", keterangan "keterangan",a.inputby "inputby#code",get_empname(a.inputby) "inputby#description"
,a.updateby "updateby", to_char(a.updatedate,'dd-mm-yyyy hh24:mi') "updatedate",verified1 "verified1", verified2 "verified2",to_char(verifieddate1,'dd-mm-yyyy') "verifieddate1", to_char(verifieddate2,'dd-mm-yyyy') "verifieddate2" from MASTERHASILINTRANS a,  vehicle c where  
--prestasi is not null and 
substr(tanggal,1,2) ||'/'|| substr(tanggal,3,2) ||'/'|| substr(tanggal,5,4) = :period
 and  GANGCODE=:vehiclecode
 and c.vehiclecode = gangcode
 --and b.vehiclegroupcode = c.vehiclegroupcode
order by tanggal,km_awal`

const detailByDateQuery = `  select a.rowid "rowid",tid "tid",'true' "datelimit",checkmandor "checkmandor", checkkerani "checkkerani",checkmandor "checkmandor_t", checkkerani "checkkerani_t",vehiclegroupcode "vehiclegroupcodedisplayonly", tanggal "tanggal",KM_AWAL "km_awal",KM_AKHIR "km_akhir",jobdescription "jobdescription",loadtypecodedesc "loadtypecodedesc",TO_char(date_awal,'hh24:mi') "date_awal",TO_CHAR(date_akhir,'hh24:mi') "date_akhir",jobcode "jobcode#code",getjob_des(jobcode) "jobcode#description",gangcode "vehiclecode",
LOCATIONTYPE "locationtype#code",NVL (get_locationdesc (locationtype), 'NA') "locationtype#description",LOCATIONCODE "locationcode#code",NVL (getloc_des (locationcode), 'NA') "locationcode#description",LOCATIONCODE_ORIGINAL "locationcode_original#code",NVL (getloc_des (locationcode), 'NA') "locationcode_original#desc",PRESTASI "prestasi",LOADTYPECODE "loadtypecode",UNITOFMEASURECODE "unitofmeasurecode",range "range",categorytransport "categorytransport#code",range "categorytransport#description", keterangan "keterangan",a.inputby "inputby#code",get_empname(a.inputby) "inputby#description",get_empposname(a.inputby) "inputby#position"
from MASTERHASILINTRANS a, vehicle b where  
--prestasi is not null and 
substr(tanggal,1,2) ||'-'|| substr(tanggal,3,2) ||'-'|| substr(tanggal,5,4) = :period
 and  
 GANGCODE=:vehiclecode
 and b.vehiclecode =gangcode
order by tanggal,km_awal`
// const detailQuery = `select * from apps_component`

const checkEntry = `  SELECT to_date(tanggal,'dd-mm-yyyy') "tanggal_date", substr(tanggal,1,2) ||'-'|| substr(tanggal,3,2) ||'-'|| substr(tanggal,5,4)"tanggal", SUM (COUNT (*)) OVER () "entries"
FROM masterhasilintrans a
WHERE     a.gangcode = :vehiclecode
AND substr(tanggal,3,2) ||'/'|| substr(tanggal,5,4) = :period
GROUP BY tanggal ,substr(tanggal,1,2) ||'-'|| substr(tanggal,3,2) ||'-'|| substr(tanggal,5,4)
order by tanggal`


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

const fetchDataDetailByDate = async function (users, routes, params, callback) {

    binds = {}

    /**
   * ! change the parameters according to the table
   */
    binds.vehiclecode = (!params.vehiclecode ? '' : params.vehiclecode)
    binds.period = (!params.period ? '' : params.period)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailByDateQuery, binds)


    } catch (error) {
        callback(error, '')
    }
    callback('', result)
}

const fetchCount = async function (users, routes, params, callback) {

    binds = {}

    /**
   * ! change the parameters according to the table
   */
    binds.vehiclecode = (!params.vehiclecode ? '' : params.vehiclecode)
    binds.period = (!params.period ? '' : params.period)

    let result

    try {
        result = await database.siteExecute(users, checkEntry, binds)


    } catch (error) {
        callback(error, '')
    }
    callback('', result)
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    fetchDataDetailByDate,
    fetchCount
}


