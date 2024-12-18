const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  e.empcode "nik_staff",e.empname "empname", e.rowid "rowid",employeetype "employeetype",description "jabatan",to_char(datejoin,'dd-mm-yyyy') "datejoin",to_char(dateterminate,'dd-mm-yyyy')  "dateterminate"
from empmasterepms e,mas_position p where e.id_position= p.code  and (e.empcode like '%'||:search ||'%' or e.empname like upper ('%'||:search ||'%'))  order by e.empcode`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid "rowid", nik_staff "nik_staff",
tid "tid",to_char(incident_date,'dd-mm-yyyy') "incident_date", incident_place "incident_place",
 description "description",to_char(s_notif_date_s,'dd-mm-yyyy') "s_notif_date_s",to_char(s_notif_date_e,'dd-mm-yyyy') "s_notif_date_e",
 decode(fg_c_offence,'0','Minor Of Notice','1','Major Of Notice','2','Graves Of Notice','3','Capital') "fg_c_offence_t", fg_c_offence "fg_c_offence",fg_s_notif "fg_s_notif",
 emp_statement "emp_statement", 
 decode(fg_s_notif, '0','Verbal Warning','1','First Written Warning','2','Second Written Warning','3','Third Written Warning','4','Suspension','5','Dismissal') "fg_s_notif_t" ,
  f_notif_by_empyr "f_notif_by_empyr", f_notif_by_emp "f_notif_by_emp", f_notif_conseq "f_notif_conseq",
   inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby",
   to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from hr_disiplinary where
    nik_staff=:nik_staff order by incident_date desc `



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


