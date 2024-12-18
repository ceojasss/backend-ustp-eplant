const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  e.empcode "nik_staff", e.empname "empname", employeetype "employeetype",e.rowid "rowid",description "jabatan",to_char(datejoin,'dd-mm-yyyy') "datejoin",to_char(dateterminate,'dd-mm-yyyy')  "dateterminate"
from empmasterepms e,mas_position p where e.id_position= p.code  and (e.empcode like '%'||:search ||'%' or e.empname like upper ('%'||:search ||'%'))  order by e.empcode`

/**
   * ! change query table detail
   */
const detailQuery = ` select h.rowid "rowid", 
h.tid "tid",
h.nik_staff "nik_staff",
decode(tax_stat_id,'TK/0' ,   'LAJANG/DUDA/JANDA  TANPA TANGGUNGAN',
'TK/1',    'LAJANG/DUDA/JANDA, 1 TANGGUNGAN',
'TK/2',    'LAJANG/DUDA/JANDA, 2 TANGGUNGAN',
'TK/3',    'LAJANG/DUDA/JANDA, 3 TANGGUNGAN',
'K/0',    'MENIKAH',
'K/1',    'MENIKAH 1 TANGGUNGAN',
'K/2',    'MENIKAH 2 TANGGUNGAN',
'K/3',    'MENIKAH 3 TANGGUNGAN') "tax_stat_id_t",
decode(rice_stat_id,'TK/0' ,   'LAJANG/DUDA/JANDA  TANPA TANGGUNGAN',
'TK/1',    'LAJANG/DUDA/JANDA, 1 TANGGUNGAN',
'TK/2',    'LAJANG/DUDA/JANDA, 2 TANGGUNGAN',
'TK/3',    'LAJANG/DUDA/JANDA, 3 TANGGUNGAN',
'K/0',    'MENIKAH',
'K/1',    'MENIKAH 1 TANGGUNGAN',
'K/2',    'MENIKAH 2 TANGGUNGAN',
'K/3',    'MENIKAH 3 TANGGUNGAN') "rice_stat_id_t",
to_char(h.datets, 'dd-mm-yyyy') "datets", 
tax_stat_id "tax_stat_id",
p.parametervalue "tax_status", 
rice_stat_id "rice_stat_id",
p.parametervalue "rice_status",
h.inputby "inputby",
to_char(h.inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
h.updateby "updateby",
to_char(h.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from HR_HIST_TAX_STATUS h, parametervalue p 
where h.nik_staff = :nik_staff  and 
parametercode='EMP02' and p.parametervaluecode = h.tax_stat_id`



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
