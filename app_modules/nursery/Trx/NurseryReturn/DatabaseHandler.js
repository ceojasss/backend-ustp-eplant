const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select nr.ROWID "rowid", RETURNCODE "returncode", nr.SIVCODE "sivcode#code",
to_char(RTNDATE,'dd-mm-yyyy') "rtndate", REMARKS "remarks", nr.INPUTBY "inputby",mrnurserycode "nurserycodedisplayonly",
 to_char(nr.inputdate,'dd-mm-yyyy hh24:mi:ss') "inputdate", nr.UPDATEBY "updateby",nr.process_flag "process_flag",v_url_preview_site (
       'NRN',
       CASE
           WHEN nr.process_flag IS NULL THEN 'DRAFT'
           ELSE 'APPROVED'
       END)||returncode "v_url_preview",
  to_char(nr.updatedate,'dd-mm-yyyy hh24:mi:ss') "updatedate" from NURSERY_RETURN nr, mr_nursery mn, siv_nursery sn
 where 
 mn.mrcode = SN.MRCODE
 and nr.sivcode = sn.sivcode and 
 --returncode between trunc(TO_DATE(:dtdate, 'dd/MM/YYYY')) and last_day(TO_DATE(:dtdate, 'dd/MM/YYYY')) and 
 (nr.returncode LIKE  UPPER('%' || :search ||'%') OR nr.sivcode LIKE  UPPER('%' || :search ||'%'))
 and to_char(rtndate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(rtndate,'mmyyyy')) ORDER BY rtndate DESC
`

/**
   * ! change query table detail
   */
const detailQuery = `select ROWID "rowid", 
tid "tid",RETURNCODE "returncode", PLOTCODE "plotcode#code", LOCATIONCODE "locationcode",
LOCATIONTYPE "locationtype", jobcode "jobcode", REMARKS "remarks", QTYRECEIVE "qtyreceive",
 QTYRETURN "qtyreturn", INPUTBY "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi:ss') inputdate, UPDATEBY "updateby",
  to_char(updatedate,'dd-mm-yyyy hh24:mi:ss') updatedate from NURSERYDETAIL_RETURN
where returncode= :returncode

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
    binds.returncode = (!params.returncode ? '' : params.returncode)

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


