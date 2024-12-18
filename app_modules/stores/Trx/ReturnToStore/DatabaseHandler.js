const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid" ,RETURNNOTENUMBER "returnnotenumber", WAREHOUSE "warehouse",
v_url_preview_site (
    'RTN',
    CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || RETURNNOTENUMBER "v_url_preview",process_flag "process_flag",
 SIVCODE "sivcode#code", to_char(rtndate,'dd-mm-yyyy')  "rtndate", REMARKS "remarks", INPUTBY "inputby",
  to_char(inputdate,'dd-mm-yyyy') "inputdate", UPDATEBY "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi')
   "updatedate"
from returntostore 
  where (returnnotenumber LIKE  UPPER('%' || :search ||'%') OR warehouse LIKE  UPPER('%' || :search ||'%') OR remarks LIKE  UPPER('%' || :search ||'%') OR sivcode LIKE  UPPER('%' || :search ||'%')) 
  and to_char(RTNDATE,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(RTNDATE,'mmyyyy')) ORDER BY RTNDATE DESC`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid "rowid" ,
tid "tid",RETURNNOTENUMBER "returnnotenumber", stockcode "stockcode#code",get_purchaseitemname(stockcode) "stockcode#description",
 qtyissue "qtyissue", qtyreturn "qtyreturn", karung "karung", jobcode "jobcode",
  locationtype "locationtype", locationcode "locationcode",INPUTBY "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi')
   "inputdate", UPDATEBY "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from returntostoredetail
where returnnotenumber= :returnnotenumber`
// const detailQuery = `select rowid "rowid" ,
// tid "tid",RETURNNOTENUMBER "returnnotenumber", stockcode "stockcode#code",get_purchaseitemname(stockcode) "stockcode#description",
//  qtyissue "qtyissue", qtyreturn "qtyreturn", karung "karung", jobcode "jobcode#code",getjob_des(jobcode) "jobcode#description",
//   locationtype "locationtype#code",get_locationdesc(locationtype) "locationtype#description", locationcode "locationcode#code",getloc_des(locationcode) "locationcode#description",INPUTBY "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi')
//    "inputdate", UPDATEBY "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
// from returntostoredetail
// where returnnotenumber= :returnnotenumber`



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
    binds.returnnotenumber = (!params.returnnotenumber ? '' : params.returnnotenumber)

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

