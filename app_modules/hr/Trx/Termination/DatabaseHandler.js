const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  e.empcode "nik_staff", e.empname "empname",e.rowid "rowid",employeetype "employeetype",description "jabatan",to_char(datejoin,'dd-mm-yyyy') "datejoin",to_char(dateterminate,'dd-mm-yyyy')  "dateterminate"
from empmasterepms e,mas_position p where e.id_position= p.code  and (e.empcode like upper('%'||:search ||'%') or e.empname like upper('%'||:search ||'%'))  order by e.empcode`

/**
   * ! change query table detail
   */
const detailQuery = `select h.rowid "rowid", h.nik_staff "nik_staff", to_char(h.terminate_date, 'dd-mm-yyyy') "terminate_date", h.term_type_id "term_type_id",h.tid"tid",p.parametervalue "name_term_type", h.reason_of_resign "reason_of_resign",
h.termination_amt "termination_amt", h.pension_amt "pension_amt", h.work_time "work_time", h.age "age", h.approved_by "approved_by",
to_char(h.approved_date, 'dd-mm-yyyy') "approved_date" from hr_termination h,parametervalue p where h.nik_staff = :nik_staff and p.parametercode='HRM04' and p.parametervaluecode=h.term_type_id`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)

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
    binds.nik_staff = (!params.nik_staff ? '' : params.nik_staff)

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
