const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select 
v.rowid "rowid" ,
v.emparid "emparid",
v.empcode "empcode", 
v.itemcode "itemcode",
v.itemdesc "itemdesc",
v.ref "ref",
to_char(v.tdate,'dd-mm-yyyy') "tdate",
v.artype "artype",
v.numofschdl "numofschdl",
to_char(v.firstduedate,'dd-mm-yyyy') "firstduedate",
to_char( v.lastduedate,'dd-mm-yyyy') "lastduedate",
v.totalqty "totalqty",
v.totalamt "totalamt",
v.remarks "remarks",
e.empname "empname",
v.inputby "inputby",
to_char(v.inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
v.updateby "updateby",
to_char(v.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  
FROM empaccountrcv v , empmasterepms e
where (v.emparid LIKE  UPPER('%' || :search ||'%') OR e.empname LIKE  UPPER('%' || :search ||'%')) 
and e.empcode = v.empcode
and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) ORDER BY tdate DESC`

/**
   * ! change query table detail
   */
const detailQuery = `select 
rowid "rowid",
tid "tid", 
emparid "emparid",
schdlid "schdlide",
to_char( duedate,'dd-mm-yyyy') "duedate",
amtdue "amtdue",
applied "applied",
inputby "inputby",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  
from empaccountrcvdtl
where emparid =:emparid 
`



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
    binds.emparid = (!params.emparid ? '' : params.emparid)

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


