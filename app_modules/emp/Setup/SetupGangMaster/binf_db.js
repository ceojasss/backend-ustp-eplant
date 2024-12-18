const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `select rowid "rowid", departmentcode "departmentcode", divisioncode "divisioncode"
from gang x where (departmentcode LIKE '%' || :search ||'%' OR divisioncode LIKE '%' || :search ||'%') and mandorecode is not null
order by departmentcode, divisioncode`

const detailQuery = `select departmentcode "departmentcode", divisioncode "divisioncode", gangcode "gangcode", gangtype "gangtype", description "description", mandorecode "mandorecode", mandore1code "mandore1code", keranicode "keranicode",  
x.inputby, to_char(x.inputdate,'dd-mm-yyyy hh24:mi:ss') inputdate, x.updateby, to_char(x.updatedate,'dd-mm-yyyy hh24:mi:ss') updatedate 
from gang x
where mandorecode is not null and departmentcode=:departmentcode
order by departmentcode, divisioncode`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    // binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

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
    binds.departmentcode = (!params.departmentcode ? '' : params.departmentcode)

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
