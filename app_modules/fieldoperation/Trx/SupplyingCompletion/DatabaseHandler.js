const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid", documentno "documentno", to_char(tdate,'dd-mm-yyyy') "tdate", 
to_char(tdate1,'dd-mm-yyyy') "tdate1", to_char(tdate2,'dd-mm-yyyy') "tdate2", kebun "kebun", 
afdeling "afdeling", inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from basisip_header
where (documentno LIKE  UPPER('%' || :search ||'%') OR tdate LIKE  UPPER('%' || :search ||'%')) 
  and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) ORDER BY tdate DESC

`

/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid",
documentno "documentno", fieldcode "fieldcode", jml_titik_empty "jml_titik_empty", 
sudah_sisip "sudah_sisip", inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from basisip_detail
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


