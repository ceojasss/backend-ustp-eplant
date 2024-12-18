const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select h.rowid "rowid",h.estatecode "estatecode", o.departmentname "departmentname",h.divisioncode "divisioncode", o.divisionname "divisionname",to_char(tdate,'dd-mm-yyyy') "tdate",h.fieldcode "fieldcode", f.description,officer,h.inputby "inputby", to_char(h.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", h.updateby "updateby", to_char(h.updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from harvestinglossheader h, organization o, fieldcrop f
where h.estatecode=o.departmentcode and h.divisioncode=o.divisioncode and h.fieldcode=f.fieldcode and (h.estatecode LIKE  UPPER('%' || :search ||'%') OR h.divisioncode LIKE  UPPER('%' || :search ||'%') OR h.fieldcode LIKE  UPPER('%' || :search ||'%') )
and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) ORDER BY tdate DESC`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid "rowid",
tid "tid",estatecode "estatecode", divisioncode "divisioncode",fieldcode "fieldcode", to_char(tdate,'dd-mm-yyyy') "tdate",lineno "lineno", sample "sample", piringan "piringan", ketiak "ketiak", pasarpikul "pasarpikul", gawangan "gawangan", busuk "busuk", 
lf_tph_1 "lf_tph_1",lf_tph_2 "lf_tph_2",lfr_tph_1 "lfr_tph_1",lfr_tph_2 "lfr_tph_2",jjg_tph_1 "jjg_tph_1" , jjg_tph_2 "jjg_tph_2",inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from harvestinglossdetail 
where estatecode = :estatecode
AND divisioncode=:divisioncode
AND fieldcode=:fieldcode 
and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) ORDER BY tdate`



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
    binds.estatecode = (!params.estatecode ? '' : params.estatecode)
    binds.divisioncode = (!params.divisioncode ? '' : params.divisioncode)
    binds.fieldcode = (!params.fieldcode ? '' : params.fieldcode)
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
