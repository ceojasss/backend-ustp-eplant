const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  e.empcode "empcode", e.empname "empname",employeetype "employeetype",e.rowid "rowid",description "jabatan",to_char(datejoin,'dd-mm-yyyy') "datejoin",to_char(dateterminate,'dd-mm-yyyy')  "dateterminate"
from empmasterepms e,mas_position p where e.id_position= p.code  and (e.empcode like '%'||:search ||'%' or e.empname like '%'||:search ||'%')  order by e.empcode`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid "rowid",
tid "tid",
empcode "empcode",
div_id "div_id",
kode1 "kode1", 
qty1_r "qty1_r",
qty1_a "qty1_a",
kode2 "kode2", 
qty2_r "qty2_r",
qty2_a "qty2_a",
kode3 "kode3", 
qty3_r "qty3_r",
qty3_a "qty3_a",
kode4 "kode4", 
qty4_r "qty4_r",
qty4_a "qty4_a",
kode5 "kode5", 
qty5_r "qty5_r",
qty5_a "qty5_a",
kode6 "kode6", 
qty6_r "qty6_r",
qty6_a "qty6_a",
kode7 "kode7", 
qty7_r "qty7_r",
qty7_a "qty7_a",
kode8 "kode8", 
qty8_r "qty8_r",
qty8_a "qty8_a",
kode9 "kode9", 
qty9_r "qty9_r",
qty9_a "qty9_a",
kode10 "kode10", 
qty10_r "qty10_r",
qty10_a "qty10_a",
remarks "remarks",
approvedby1 "approvedby1",
to_char(approvedate1, 'dd-mm-yyyy') "approvedate1",
approvedby2 "approvedby2",
to_char(approvedate2, 'dd-mm-yyyy') "approvedate2",
approvedby3 "approvedby3",
to_char(approvedate3, 'dd-mm-yyyy') "approvedate3",
inputby "inputby",
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate",
status_req "status_req",
kode11 "kode11", 
qty11_r "qty11_r",
qty11_a "qty11_a",
kode12 "kode12", 
qty12_r "qty12_r",
qty12_a "qty12_a",
kode13 "kode13", 
qty13_r "qty13_r",
qty13_a "qty13_a",
kode14 "kode14", 
qty14_r "qty14_r",
qty14_a "qty14_a",
kode15 "kode15", 
qty15_r "qty15_r",
qty15_a "qty15_a"
from hr_atk where empcode=:empcode
and TO_CHAR (approvedate1, 'mmyyyy') =
NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'),
     TO_CHAR (approvedate1, 'mmyyyy'))
and TO_CHAR (approvedate2, 'mmyyyy') =
NVL (TO_CHAR (TO_DATE ( :period2, 'MM/YYYY'), 'mmyyyy'),
     TO_CHAR (approvedate2, 'mmyyyy'))
and TO_CHAR (approvedate3, 'mmyyyy') =
NVL (TO_CHAR (TO_DATE ( :period3, 'MM/YYYY'), 'mmyyyy'),
     TO_CHAR (approvedate3, 'mmyyyy'))
ORDER BY approvedate1, approvedate2, approvedate3`



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
    binds.empcode = (!params.empcode ? '' : params.empcode)
    binds.period = (!params.period ? '' : params.period)
    binds.period2 = (!params.period2 ? '' : params.period2)
    binds.period3 = (!params.period3 ? '' : params.period3)

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
