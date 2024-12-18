const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT DISTINCT rowid "rowid",
DOCNUM "docnum",
to_char(DOCDATE, 'dd-mm-yyyy') "docdate", 
NIK_STAFF "nik_staff", 
GET_EMPNAME(NIK_STAFF) "nik_staff1", 
RESP_ID "resp_id",
TOTAL "total",
REIM_AMOUNT "reim_amount",
CURR_CODE "cure_code",
to_char(REIM_DATE,'dd-mm-yyyy') "reim_date",
inp_by   "inp_by",
to_char(inp_date,'dd-mm-yyyy') "inp_date",
upd_by  "upd_by",
to_char(upd_date,'dd-mm-yyyy') "upd_date"
from HR_IN_MED 
WHERE (docnum LIKE  UPPER('%' || :search ||'%') OR nik_staff LIKE UPPER('%' || :search ||'%'))`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid "rowid", tid "tid",
docnum "docnum", 
reference_no "reference_no",
relation_id "relation_id",
med_name "med_name",
ailman_name "ailman_name",
rawat_id "rawat_id",
affcat_id "affcat_id",
expense_id "expense_id",
amount "amount",
reim_persen "reim_persen",
reim_amount "reim_amount",
to_char(visit_date,'dd-mm-yyyy') "visit_date",
notes "notes",
inp_by   "inp_by",
to_char(inp_date,'dd-mm-yyyy') "inp_date",
upd_by  "upd_by",
to_char(upd_date,'dd-mm-yyyy') "upd_date"
from HR_IN_MEDDETAIL 
where docnum= :docnum`




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
    binds.docnum = (!params.docnum ? '' : params.docnum)

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
