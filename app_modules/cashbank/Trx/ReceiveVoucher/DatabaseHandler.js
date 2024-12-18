const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT rowid "rowid",vouchercode	"vouchercode", bankcode "bankcode" ,to_char(datecreated,'dd-mm-yyyy') "datecreated",
CASE WHEN :loginid not like '%HO' then v_url_preview_site (
    'RVSO',
    CASE
        WHEN VOUCHERCODE IS NULL THEN 'DRAFT'
        ELSE 'APPROVED'
    END)
|| VOUCHERCODE
else 
v_url_preview_site (
    'RV',
    CASE
        WHEN VOUCHERCODE IS NULL THEN 'DRAFT'
        ELSE 'APPROVED'
    END)
|| VOUCHERCODE end "v_url_preview"
 ,totalamount "totalamount" ,currency "currency",rate "rate" ,chequenumber "chequenumber",
 inputby                                       "inputby",
TO_CHAR (inputdate, 'dd-mm-yyyy hh24:mi')             "inputdate",
updateby                                      "updateby",
process_flag "process_flag",
TO_CHAR (updatedate, 'dd-mm-yyyy hh24:mi')    "updatedate"
 FROM receivevoucher 
 where   (vouchercode LIKE  UPPER('%' || :search ||'%') OR totalamount LIKE  UPPER('%' || :search ||'%'))
  and 
  case when :loginid not like '%HO' and vouchercode like '%HO%' then null  else vouchercode end = vouchercode and
  TO_CHAR (datecreated, 'mmyyyy') =
  decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
  TO_CHAR (datecreated, 'mmyyyy'))
  ORDER BY DATECREATED DESC`

/**
 * ! change query table detail
 */
const detailQuery = ` select rowid "rowid",tid "tid",vouchercode "vouchercode", 
locationtype "locationtype#code",get_locationdesc (locationtype) "locationtype#description",
locationcode "locationcode#code",getloc_des (locationcode) "locationcode#description",
jobcode  "jobcode#code",getjob_des (jobcode)"jobcode#description",
amount "amount" ,reference "reference", remarks "remarks",
CASHFLOWCODE "cashflowcode#code" , GET_PARAMETERVALUE('Cash', 'EPMS104',cashflowcode) "cashflowcode#description"  
from receivevoucherdetail
where vouchercode= :vouchercode`



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
    binds.vouchercode = (!params.vouchercode ? '' : params.vouchercode)

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



