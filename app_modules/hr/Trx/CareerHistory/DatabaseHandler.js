const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  e.empcode "nik_staff", e.empname "empname",e.rowid "rowid",employeetype "employeetype",description "jabatan",to_char(datejoin,'dd-mm-yyyy') "datejoin",to_char(dateterminate,'dd-mm-yyyy')  "dateterminate"
from empmasterepms e,mas_position p where e.id_position= p.code  and (e.empcode like '%'||:search ||'%' or e.empname like upper('%'||:search ||'%'))  order by e.empcode`

/**
   * ! change query table detail
   */
const detailQuery = `select 
h.rowid "rowid",
tid "tid", 
job_spec "job_spec",
nik_staff  "nik_staff", 
to_char(h.tgl_awal,'dd-mm-yyyy') "tgl_awal",
to_char(h.tgl_akhir,'dd-mm-yyyy') "tgl_akhir",
h.level_id "level_id",
h.id_position "id_position#code",
m.description "id_position#description",
h.id_job_class "id_job_class",
h.dept_id "dept_id",
h.nik_manager "nik_manager",
h.boss_position "boss_position#code",
h.boss_position "boss_position#description",
h.unit_id "unit_id",
h.departmentcode "departmentcode#code",
o.departmentname "departmentcode#description",
h.divisioncode "divisioncode#code",
o.divisionname "divisioncode#description",
h.housingcode "housingcode", 
h.housingno "housingno", 
h.inputby "inputby", 
to_char(h.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
h.updateby "updateby",
to_char(h.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
from hr_hist_staff h,organization o , empmasterepms e,mas_position m where nik_staff = :nik_staff and h.nik_staff = e.empcode and
h.departmentcode = o.departmentcode and h.id_position = m.code and h.divisioncode = o.divisioncode
`



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
