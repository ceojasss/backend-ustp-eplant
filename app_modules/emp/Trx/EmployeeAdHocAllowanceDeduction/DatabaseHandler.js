const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT 
v.tid "tid",
v.empcode "empcode",
e.empname "empname",
e.employeetype "employeetype",
v.allowdedcode "allowdedcode",
to_char(v.adhocdate,'dd-mm-yyyy') "adhocdate",
v.inputby "inputby",
to_char(v.inputdate,'dd-mm-yyyy hh24:mi') "inputdate" ,
v.updateby "updateby",
to_char(v.updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
FROM empallded v , empmasterepms e
where (v.empcode LIKE  UPPER('%' || :search ||'%') OR v.allowdedcode LIKE  UPPER('%' || :search ||'%')) 
and e.empcode = v.empcode
and to_char(v.adhocdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(v.adhocdate,'mmyyyy')) ORDER BY v.adhocdate DESC
`

/**
   * ! change query table detail
   */
const detailQuery = `
select 
e.rowid "rowid",
e.tid "tid",
e.allowdedcode "allowdedcode",
a.description "description",
e.amount  "amount",
e.fixedallded "fixedallded",
e.inputby "inputby",
to_char(e.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
e.updateby "updateby", 
to_char(e.updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from empallded e, allowded a 
where e.allowdedcode=:allowdedcode
and e.allowdedcode = a.allowdedcode
and to_char(e.adhocdate,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(e.adhocdate,'mmyyyy')) ORDER BY e.adhocdate DESC`




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
    binds.allowdedcode = (!params.allowdedcode ? '' : params.allowdedcode)
    binds.period = (!params.period ? '' : params.period)

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


