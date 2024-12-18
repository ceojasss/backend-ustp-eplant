const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `
select rowid "rowid" ,jvno "jvno", batchno "batchno",financialyear "financialyear",periodno "periodno", 
to_char(transactiondate,'dd-mm-yyyy')  "transactiondate",to_char(datecreate,'dd-mm-yyyy')  "datecreate", 
v_url_preview_site (
   'JV',
   CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || jvno "v_url_preview",
currencycode "currencycode",  userrate "userrate",totalamount "totalamount", transactiondescription "transactiondescription", process_flag "process_flag",
inputby "inputby",  to_char(inputdate,'dd-mm-yyyy hh24:mi')  "inputdate", updateby "updateby",  to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from journalvoucher
 where 
 case when :loginid not like '%HO' and jvno like '%HO%' then null  else jvno end = jvno
 and ( jvno LIKE  UPPER('%' || :search ||'%') 
 OR BATCHNO LIKE  UPPER('%' || :search ||'%') 
 OR totalamount LIKE  UPPER('%' || :search ||'%')
 OR inputby LIKE  UPPER('%' || :search ||'%'))
 and case when :loginid not like '%HO' and jvno like '%HO%' then null  else jvno end = jvno
 AND TO_CHAR (transactiondate, 'mmyyyy') =
 decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
 TO_CHAR (transactiondate, 'mmyyyy')) ORDER BY transactiondate DESC`



/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid" ,
tid "tid",jvno "jvno", jobcode "jobcode#code",
getjob_des(jobcode) "jobcode#description", locationtype "locationtype#code", get_locationdesc (locationtype) "locationtype#description",
locationtypecode "locationtypecode#code", getloc_des (locationtypecode)"locationtypecode#description", remarks "remarks",
 debit "debit", credit "credit", faktur "faktur", faktur_pajak "faktur_pajak",
 inputby "inputby",  to_char(inputdate,'dd-mm-yyyy hh24:mi')  "inputdate", updateby "updateby",  to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from jvdetails
where jvno= :jvno`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}

// console.log(users.loginid)
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
    binds.jvno = (!params.jvno ? '' : params.jvno)

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
