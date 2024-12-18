const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select ROWID "rowid", DOCUMENTNO "documentno", to_char(TDATE,'dd-mm-yyyy') "TDATE",
to_char(TDATE1,'dd-mm-yyyy') "TDATE1", to_char(TDATE2,'dd-mm-yyyy') "TDATE2", KEBUN "kebun",
 AFDELING "afdeling", INPUTBY "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') inputdate, 
 UPDATEBY "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') updatedate from batanam_header
where 
--documentno between trunc(TO_DATE(:dtdate, 'dd/MM/YYYY')) and last_day(TO_DATE(:dtdate, 'dd/MM/YYYY')) and 
(kebun LIKE  UPPER('%' || :search ||'%') OR afdeling LIKE  UPPER('%' || :search ||'%'))
and to_char(TDATE1,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(TDATE1,'mmyyyy')) ORDER BY TDATE1 DESC

`

/**
   * ! change query table detail
   */
const detailQuery = ` select ROWID "rowid", 
tid "tid",DOCUMENTNO "documentno", FIELDCODE "fieldcode",
ASAL_BIBIT "asal_bibit", TANAM "tanam", SPHREAL "sphreal", HECTARAGE_DETAIL "hectarage_detail",
 HECTARAGEGPS "hectaragegps", inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from batanam_detail
where documentno= :documentno

`



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
    binds.documentno = (!params.documentno ? '' : params.documentno)

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


