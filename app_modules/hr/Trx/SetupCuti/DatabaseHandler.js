const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */

const baseQuery = `SELECT emp.ROWID "rowid",
emp.empcode "nik_staff",
emp.empname "empname",
emp.employeetype "emptype",
to_char(emp.datejoin,'dd-mm-yyyy') "tmk"
FROM epms_ustp.empmasterepms emp, epms_ustp.mas_position mp
WHERE     emp.id_position = mp.code
AND DATETERMINATE IS NULL
AND (   UPPER (emp.empcode) LIKE UPPER ('%' || :search || '%')
 OR UPPER (emp.empname) LIKE UPPER ('%' || :search || '%'))
ORDER BY emp.empcode ASC`

const baseQuery1 =`
select  e.empcode "empcode", e.empname "empname",
employeetype "emptype",e.rowid "rowid",
to_char(datejoin,'dd-mm-yyyy') "tmk"
from empmasterepms e,mas_position p 
where e.id_position= p.code  
and (e.empcode like '%'||:search ||'%' or e.empname like '%'||:search ||'%')  order by e.empcode
`


const detailQuery = `
Select h.rowid"rowid",
h.tid"tid",
nik_staff"nik_staff",
GET_EMPNAME(NIK_STAFF)"empname",
h.leave_type"leave_type",
hr.description"description",
to_char(beg_periode,'dd-mm-yyyy')"beg_periode",
to_char(end_periode,'dd-mm-yyyy')"end_periode",
leavedays"leavedays",
remark"remark",
to_char(inp_date,'dd-mm-yyyy')"inp_date",
inp_by"inp_by",
to_char(upd_date,'dd-mm-yyyy')"upd_date",
upd_by"upd_by"
from hr_leave_day h ,hr_ref_leavetype hr
where h.leave_type=hr.leave_type and
nik_staff=:nik_staff
order by beg_periode ASC
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


