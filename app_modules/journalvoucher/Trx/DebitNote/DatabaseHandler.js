const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */

const baseQuery =`Select 
d.ROWID "rowid",
d.DRNOTEID"drnoteid",
d.DRNOTEUSERCODE "drnoteusercode",
to_char(d.DRNOTEDATE,'dd-mm-yyyy') "drnotedate",
d.DRNOTEDESC"drnotedesc",
d.INVCODEREF"invcoderef",
d.CURRID "currid",
d.DRINVAMTAPPLIED"drinvamtapplied",
d.DRNOTETYPECODE"drnotetypecode",
to_char(d.INPUTDATE,'dd-mm-yyyy  hh24:mi') "inputdate",
to_char(d.UPDATEDATE,'dd-mm-yyyy  hh24:mi') "updatedate",
d.INPUTBY "inputby",
d.UPDATEBY "updateby"
FROM drnote d 
WHERE drnoteid=drnoteid and
(DRNOTEUSERCODE LIKE UPPER ('%' || :search || '%')) and
to_char(d.DRNOTEDATE,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),
to_char(d.DRNOTEDATE,'mmyyyy')) order by d.DRNOTEDATE asc`
/**
   * ! change query table detail
   */

const detailQuery =`SELECT ROWID "rowid", 
TID "tid",
DRNOTEID "drnoteid",
jobcode "jobcode#code",
getjob_des(jobcode) "jobcode#description", 
locationtype "locationtype#code", 
get_locationdesc (locationtype) "locationtype#description",
locationtypecode "locationtypecode#code", 
getloc_des (locationtypecode)"locationtypecode#description",
DBNAMOUNT"dbnamount"
from drnote_d 
WHERE DRNOTEID=:DRNOTEID`

const fetchDataHeader = async function (users, params, routes, callback) {

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
    binds.drnoteid = (!params.drnoteid ? '' : params.drnoteid)

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
    fetchDataDetail,
}




