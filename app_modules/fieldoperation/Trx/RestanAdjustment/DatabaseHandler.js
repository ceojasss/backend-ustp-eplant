const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select DISTINCT f.estatecode "estate", DEPARTMENTNAME "departmentname",r.divisi "divisi",DIVISIONNAME "divisionname",to_char(r.adjdate,'dd-mm-yyyy') "adjdate" ,r.inputby "inputby", 
to_char(r.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", r.updateby "updateby", to_char(r.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"from ORGANIZATION O,restanadjustment r, fieldcrop f
where o.departmentcode = r.estate
AND O.DIVISIONCODE = r.divisi 
AND f.fieldcode = r.blockid
and (r.estate LIKE '%'  || :search || '%' OR r.divisi LIKE '%' || :search || '%') and TO_CHAR (r.adjdate, 'mmyyyy') = NVL (TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'), 'mmyyyy'),
TO_CHAR (r.adjdate, 'mmyyyy'))`

/**
 * ! change query table detail
 */
const detailQuery = `select r.rowid "rowid",
r.estate "estate" ,r.divisi "divisi",r.blockid "blockid", to_char(r.adjdate,'dd-mm-yyyy') "adjdate", r.adjustqty "adjustqty", to_char(r.authorized_date,'dd-mm-yyyy') "authorized_date", 
r.authorized_remark "authorized_remark", to_char(r.inputadjdate,'dd-mm-yyyy') "inputadjdate",reason "reason",p.parametervalue "description",authorized "authorized" from restanadjustment r,parametervalue p where r.estate=:estate
AND r.reason = p.parametervaluecode
AND p.parametercode='FOP37'
AND r.divisi=:divisi  and  to_char (r.adjdate, 'mmyyyy') = NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'),
TO_CHAR (r.adjdate, 'mmyyyy')) order by r.adjdate DESC`



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
    binds.estate = (!params.estate ? '' : params.estate)
    binds.divisi = (!params.divisi ? '' : params.divisi)
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

