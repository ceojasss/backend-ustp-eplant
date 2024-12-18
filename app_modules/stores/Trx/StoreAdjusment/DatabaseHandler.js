const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid" ,voucher# "voucher#", to_char(adjusmentdate, 'dd-mm-yyyy') "adjusmentdate", storecode "storecode", 
adjdescription "adjdescription", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", 
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" 
 from storeadjusment
  where (voucher# LIKE  UPPER('%' || :search ||'%') OR adjdescription LIKE  UPPER('%' || :search ||'%')) 
  and to_char(ADJUSMENTDATE,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(ADJUSMENTDATE,'mmyyyy')) ORDER BY ADJUSMENTDATE DESC`

/**
   * ! change query table detail
   */
const detailQuery = `select 
rowid "rowid" ,
tid "tid",
voucher# "voucher#", 
stockcode "stockcode#code",
get_purchaseitemname(stockcode) "stockcode#description", 
jobcode "jobcode#code", 
getjob_des(jobcode) "jobcode#description", 
locationtype "locationtype#code", 
get_locationdesc (locationtype) "locationtype#description",
locationcode "locationcode#code", 
getloc_des (locationcode)"locationcode#description", 
qty "qty", 
amount "amount", 
inputby "inputby", 
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", 
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"  
from storeadjusmentdetail where voucher#= :voucher#`



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
    binds['voucher#'] = (!params['voucher#'] ? '' : params['voucher#'])

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


