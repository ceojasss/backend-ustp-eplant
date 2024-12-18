const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

    /**
     * ! change query table header
     */
const baseQuery = `select x.rowid "rowid",
x.allowdedcode "allowdedcode",
a.description  "description"
from allowded_fix x, allowded a
where x.allowdedcode = a.allowdedcode and
(x.allowdedcode LIKE  UPPER('%' || :search ||'%'))
group by x.allowdedcode,x.rowid,a.description
 order by x.allowdedcode,x.rowid `
  /**
     * ! change query table detail
     */
const detailQuery = ` select  rowid "rowid",allowdedcode "allowdedcode", amount "amount", allowance "allowance", emptype "emptype",
x.inputby "inputby", to_char(x.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", x.updateby "updateby", to_char(x.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from allowded_fix x
where allowdedcode= :allowdedcode
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
    binds.allowdedcode = (!params.allowdedcode ? '' : params.allowdedcode)

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