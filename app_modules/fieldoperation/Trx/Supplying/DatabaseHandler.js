const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT rowid "rowid" , to_char(tanggal,'dd-mm-yyyy') "tanggal", kebun "kebun",  afdeling "afdeling", 
inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", 
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from sisip_header x
  where (kebun LIKE  UPPER('%' || :search ||'%') OR tanggal LIKE  UPPER('%' || :search ||'%')) 
  and to_char(tanggal,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tanggal,'mmyyyy')) ORDER BY tanggal DESC
`

/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid",KEBUN "kebun",to_char(tanggal,'dd-mm-yyyy') "tanggal",fieldcode "fieldcode", sph "sph", 
jml_titik_tanam "jml_titik_tanam", sisip_hariini "sisip_hariini", jml_nurseryissue "jml_nurseryissue",inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", 
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from sisip_detail
where kebun= :kebun
and to_char(tanggal,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(tanggal,'mmyyyy')) ORDER BY tanggal`



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
    binds.kebun = (!params.kebun ? '' : params.kebun)
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


