const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `
select  
    ROWID "rowid", 
    PYEAR "pyear", 
    PMONTH "pmonth",
    TO_CHAR (WORKDATE, 'mmyyyy')     "period"
FROM EMPWORKINGDAYSTATUS 
where to_char(WORKDATE,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(WORKDATE,'mmyyyy'))
AND ( PYEAR LIKE '%' || :search || '%'
OR PMONTH LIKE '%' || :search || '%')
ORDER BY PYEAR`


const detailQuery = `
select  
ROWID "rowid", 
TID "tid",
pyear "pyear",
pmonth "pmonth",
WORKWEEK "workweek",
to_char(WORKDATE,'dd-mm-yyyy') "workdate",
ATTDCODE "attdcode",
REMARKS "remarks",
inputby "inputby",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
FROM EMPWORKINGDAYSTATUS 
where 
 pyear = :pyear AND 
 pmonth = :pmonth  
 ORDER BY WORKDATE DESC`


/**
 * ! change query table detail
 */
const detailByDateQuery = `select  
ROWID "rowid", 
TID "tid",
WORKWEEK "workweek",
to_char(WORKDATE,'dd-mm-yyyy') "workdate",
ATTDCODE "attdcode",
REMARKS "remarks",
inputby "inputby",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
FROM EMPWORKINGDAYSTATUS 
where 
 pyear = :pyear AND 
 pmonth = :pmonth
 ORDER BY WORKDATE DESC` 

const checkEntry = `SELECT 
WORKDATE "workdate_date", 
to_char(WORKDATE,'dd-mm-yyyy')"workdate", 
SUM (COUNT (*)) OVER () "entries"
FROM EMPWORKINGDAYSTATUS
WHERE     pyear = :pyear 
 AND TO_CHAR (WORKDATE, 'mmyyyy') =
     NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'),
          TO_CHAR (WORKDATE, 'mmyyyy'))
GROUP BY workdate ,to_char(workdate,'dd-mm-yyyy')
order by workdate`


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
    binds.pyear = (!params.pyear ? '' : params.pyear)
    binds.pmonth = (!params.pmonth ? '' : params.pmonth)
    


    let result

    console.log('binds :' , binds);

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
    binds.pyear = (!params.pyear ? '' : params.pyear)
    binds.pmonth = (!params.pmonth ? '' : params.pmonth)
    // binds.periodone = (!params.periodone ? '' : params.periodone)
    // binds.periodtwo = (!params.periodtwo ? '' : params.periodtwo)

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
    binds.pyear = (!params.pyear ? '' : params.pyear)
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
    fetchCount,
    fetchDataDetailByDate
}



