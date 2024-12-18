const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select 
to_char(firstduedate, 'dd-mm-yyyy') "tdate",
get_empname(x.empcode) "empcode", 
x.emparid "emparid", 
x.itemcode "itemcode",
x.itemdesc "itemdesc",
x.seq "seq",
x.ref "ref",
x.artype "artype",
to_char(x.firstduedate, 'dd-mm-yyyy') "firstduedate",
to_char(x.updatedate, 'dd-mm-yyyy') "updatedate",
x.ispickup "ispickup",
x.alldedcode "alldedcode",
x.balanceamount "balanceamount"
from empaccountrcvoth x, empmasterepms g
where x.empcode = g.empcode
and (x.emparid LIKE  UPPER('%' || :search ||'%') OR x.empcode 
LIKE  UPPER('%' || :search ||'%')) and to_char(firstduedate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(firstduedate,'mmyyyy')) 
order by firstduedate DESC`

/**
   * ! change query table detail
   */
const detailQuery = `select 
rowid "rowid",
emparid "emparid",
tid "tid",
schdlid "schdlide",
to_char(duedate,'dd-mm-yyyy') "duedate",
amtdue "amtdue",
applied "applied"
from empaccountrcvdtloth
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


