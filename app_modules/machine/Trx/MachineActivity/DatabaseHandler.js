const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `  SELECT   DISTINCT
v.ROWID "rowid",
v.machinecode "machinecode",
v.description "description",
v.groupcode "groupcode",
CASE
   WHEN SUM(CASE WHEN A.TID IS NOT NULL THEN 0 ELSE 1 END)
           OVER (
              PARTITION BY v.machinecode,
                           TO_CHAR (a.workdate, 'mmyyyy')
           ) <> 0
   THEN
      'CLOSED'
   ELSE
      decode(jumlah_flag,0,'APPROVED',NULL)
END
   "process_flag",
g.description "group_description",
TO_CHAR (a.workdate, 'mmyyyy') "period"
FROM   machine v, machineactivity a, machinegroup g, (select sum(case when process_flag='APPROVED' then 0 else 1 end) jumlah_flag from machineactivity where TO_CHAR (workdate, 'mmyyyy') =
      NVL (TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
           TO_CHAR (workdate, 'mmyyyy'))) x
WHERE   v.machinecode = a.machinecode AND v.groupcode = g.groupcode
AND TO_CHAR (workdate, 'mmyyyy') =
      NVL (TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
           TO_CHAR (workdate, 'mmyyyy'))
AND (   v.machinecode LIKE '%' || :search || '%'
     OR v.description LIKE '%' || :search || '%'
     OR v.groupcode LIKE '%' || :search || '%'
     OR a.updateby LIKE '%' || :search || '%'
     OR a.inputby LIKE '%' || :search || '%'
     OR g.description LIKE '%' || :search || '%')
ORDER by v.machinecode`

/**
 * ! change query table detail
 */
const detailQuery = `select rowid "rowid",
tid "tid",machinecode "machinecode",
TO_CHAR (workdate, 'dd-mm-yyyy') "workdate",
TO_CHAR (from_time, 'hh24:mi') "from_time",
TO_CHAR (to_time, 'hh24:mi') "to_time",
runninghours "runninghours",
downtime "downtime",
remarks "remarks",reason "reason",
locationtype "locationtype#code",
get_locationdesc (locationtype) "locationtype#description",
locationcode "locationcode#code",
getloc_des (locationcode) "locationcode#description",
jobcode  "jobcode#code",
getjob_des (jobcode)     "jobcode#description",
amount "amount",run_start "run_start", run_end "run_end",
inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
elapstime(to_date(to_char(workdate,'dd/mm/yyyy') ||' '|| to_char(from_time,'hh24:mi'),'dd/mm/yyyy hh24:mi'), 
to_date(to_char(from_time,'dd/mm/yyyy') ||' '|| to_char(to_time,'hh24:mi'),'dd/mm/yyyy hh24:mi'),1) "tottimedisplayonly"
from Machineactivity
WHERE machinecode = :machinecode 
AND TO_CHAR (workdate, 'mmyyyy') = NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'), TO_CHAR (workdate, 'mmyyyy')) 
ORDER BY machinecode`



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
    binds.machinecode = (!params.machinecode ? '' : params.machinecode)
    binds.period = (!params.period ? '' : params.period)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


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
    binds.machinecode = (!params.machinecode ? '' : params.machinecode)
    binds.p_year = (!params.p_year ? '' : params.p_year)
    binds.p_month = (!params.p_month ? '' : params.p_month)
    binds
    let result
    let statement = `BEGIN  
    update_avail_mavh (:p_year,:p_month,:machinecode);  
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
    update_avail_mavh
}
