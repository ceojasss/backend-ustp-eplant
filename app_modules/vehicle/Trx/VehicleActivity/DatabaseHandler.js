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
CASE
WHEN SUM (CASE WHEN A.TID IS NOT NULL THEN 0 ELSE 1 END) OVER (partition by v.vehiclecode,to_char(VEHDATE,'mmyyyy')) <>
0
THEN
'CLOSED'
ELSE
a.process_flag
END                                        "process_flag",
g.description                     "group_description",
TO_CHAR (a.vehdate, 'mmyyyy')     "period" 
FROM vehicle v, vehicleactivity a, vehiclegroup g
WHERE     v.vehiclecode = a.vehiclecode
AND v.vehiclegroupcode = g.vehiclegroupcode
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
const detailQuery = `  SELECT "rowid","tid","vehiclecode","vehdate","description","locationtype#code","locationtype#description","locationcode#code",
"locationcode#description","loadtype#code","loadtype#description","reason","jobcode#code","jobcode#description","amount","from_time","to_time","from_qty","status_transfer",
"to_qty","quantity","units",NVL(quarry,'') "quarry#code",b.description "quarry#description",xx."inputby",xx."inputdate",xx."updateby",xx."updatedate","uom","sivcode",
"siv_jobcode","siv_stockcode","siv_qty","siv_locationcode","tottimedisplayonly"  FROM
(SELECT a.ROWID "rowid", tid "tid",
vehiclecode "vehiclecode", TO_CHAR (vehdate, 'dd-mm-yyyy') "vehdate",
a.description "description", locationtype "locationtype#code",
NVL (get_locationdesc (locationtype), 'NA') "locationtype#description",
locationcode "locationcode#code",
NVL (getloc_des (locationcode), 'NA') "locationcode#description",
NVL (loadtype, 'NA') "loadtype#code",
GET_LOADTYPEDESC (NVL (loadtype, 'NA')) "loadtype#description",
jobcode "jobcode#code", NVL (getjob_des (jobcode), 'NA') "jobcode#description",
amount "amount", TO_CHAR (from_time, 'hh24:mi') "from_time",
TO_CHAR (to_time, 'hh24:mi') "to_time",
status_transfer "status_transfer", reason "reason",
uom "uom",
sivcode "sivcode",
siv_jobcode "siv_jobcode",
siv_stockcode "siv_stockcode",siv_qty "siv_qty",siv_locationcode "siv_locationcode",
a.from_qty "from_qty", a.to_qty "to_qty", quantity "quantity", units "units",
inputby "inputby",  to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate",quarry,
elapstime(to_date(to_char(vehdate,'dd/mm/yyyy') ||' '|| to_char(from_time,'hh24:mi'),'dd/mm/yyyy hh24:mi'), 
to_date(to_char(from_time,'dd/mm/yyyy') ||' '|| to_char(to_time,'hh24:mi'),'dd/mm/yyyy hh24:mi'),1) "tottimedisplayonly"
FROM vehicleactivity a 
WHERE     a.vehiclecode = :vehiclecode 
AND TO_CHAR (VEHDATE, 'mmyyyy') =
NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'),
   TO_CHAR (VEHDATE, 'mmyyyy'))
   --AND ROWNUM < 100
ORDER BY a.vehdate, to_date(to_char(a.vehdate,'ddmmyyyy')||' '||to_char(a.from_time,'hh24:mi:ss'),'ddmmyyyy hh24:mi:ss')
) xx left join blockmaster b on xx.quarry = B.BLOCKID`


/**
 * ! change query table detail
 */
const detailByDateQuery = `SELECT "rowid",
"tid",
"vehiclecode",
"vehdate",
"description",
"locationtype#code",
"locationtype#description",
"locationcode#code",
"locationcode#description",
"loadtype#code",
"loadtype#description",
"jobcode#code",
"jobcode#description",
"amount",
"from_time",
"to_time",
"from_qty",
"status_transfer",
"to_qty",
"quantity",
"units",
NVL (quarry, '')     "quarry#code",
b.description        "quarry#description",
xx."inputby",
xx."inputdate",
xx."updateby",
xx."updatedate",
"uom",
"sivcode",
"siv_jobcode",
"siv_stockcode",
"siv_qty",
"siv_locationcode",
"tottimedisplayonly",
"reason",
'true' "datelimit"
FROM (  SELECT a.ROWID
              "rowid",
          tid
              "tid",
          vehiclecode
              "vehiclecode",
          TO_CHAR (vehdate, 'dd-mm-yyyy')
              "vehdate",
          a.description
              "description",
          locationtype
              "locationtype#code",
          NVL (get_locationdesc (locationtype), 'NA')
              "locationtype#description",
          locationcode
              "locationcode#code",
          NVL (getloc_des (locationcode), 'NA')
              "locationcode#description",
          NVL (loadtype, 'NA')
              "loadtype#code",
          GET_LOADTYPEDESC (NVL (loadtype, 'NA'))
              "loadtype#description",
          jobcode
              "jobcode#code",
          NVL (getjob_des (jobcode), 'NA')
              "jobcode#description",
          amount
              "amount",
          TO_CHAR (from_time, 'hh24:mi')
              "from_time",
          TO_CHAR (to_time, 'hh24:mi')
              "to_time",
          status_transfer
              "status_transfer",
          uom
              "uom",
          sivcode
              "sivcode",
          siv_jobcode
              "siv_jobcode",
          siv_stockcode
              "siv_stockcode",
          siv_qty
              "siv_qty",
          siv_locationcode
              "siv_locationcode",
          a.from_qty
              "from_qty",
          a.to_qty
              "to_qty",
          quantity
              "quantity",
          units
              "units",
          inputby
              "inputby",
          TO_CHAR (inputdate, 'dd-mm-yyyy hh24:mi')
              "inputdate",
          updateby
              "updateby",
          TO_CHAR (updatedate, 'dd-mm-yyyy hh24:mi')
              "updatedate",
          quarry,
          elapstime(to_date(to_char(vehdate,'dd/mm/yyyy') ||' '|| to_char(from_time,'hh24:mi'),'dd/mm/yyyy hh24:mi'), 
to_date(to_char(from_time,'dd/mm/yyyy') ||' '|| to_char(to_time,'hh24:mi'),'dd/mm/yyyy hh24:mi'),1) "tottimedisplayonly",reason "reason"
     FROM vehicleactivity a
    WHERE     a.vehiclecode = :vehiclecode
          AND VEHDATE between TO_DATE ( :periodone, 'dd-mm-yyyy') and TO_DATE ( :periodtwo, 'dd-mm-yyyy')
 ORDER BY  a.vehdate, to_date(to_char(a.vehdate,'ddmmyyyy')||' '||to_char(a.from_time,'hh24:mi:ss'),'ddmmyyyy hh24:mi:ss')) xx
LEFT JOIN blockmaster b ON xx.quarry = B.BLOCKID`

const checkEntry = `  SELECT vehdate "vehdate_date", to_char(vehdate,'dd-mm-yyyy')"vehdate", SUM (COUNT (*)) OVER () "entries"
FROM vehicleactivity a
WHERE     a.vehiclecode = :vehiclecode
     AND TO_CHAR (VEHDATE, 'mmyyyy') =
         NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'),
              TO_CHAR (VEHDATE, 'mmyyyy'))
GROUP BY vehdate ,to_char(vehdate,'dd-mm-yyyy')
order by vehdate`



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

    console.log('binds vh : ',binds);

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
    binds.periodone = (!params.periodone ? '' : params.periodone)
    binds.periodtwo = (!params.periodtwo ? '' : params.periodtwo)

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
const update_avail_mavh = async function (users, params) {

    binds = {
        // agreementcode: params.agreementcode,
        // rid: {
        //     type: oracledb.STRING,
        //     dir: oracledb.BIND_OUT
        // }
    }

// console.log(params)
    binds.vehiclecode = (!params.vehiclecode ? '' : params.vehiclecode)
    binds.p_year = (!params.p_year ? '' : params.p_year)
    binds.p_month = (!params.p_month ? '' : params.p_month)
    binds
    let result
    let statement = `BEGIN  
    update_avail_mavh (:p_year,:p_month,:vehiclecode);  
     END;`
    // console.log(params)
    try {
        result = await database.execFunc(users, statement, binds)

        // console.log(result)
    } catch (error) {
        return result
    }



    return result
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    fetchCount,
    fetchDataDetailByDate,
    update_avail_mavh
}



