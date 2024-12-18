const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `SELECT rowid "rowid", gangcode "gangcode", description "description", mandore1code "mandore1code",get_empname(mandore1code) "mandore1name", functioncode "functioncode", mandorecode "mandorecode",get_empname(mandorecode) "mandorename" ,keranicode "keranicode", get_empname(keranicode) "keraniname",gangtype "gangtype", departmentcode "departmentcode", divisioncode "divisioncode", inputby "inputby", updateby "updateby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from gang where  (gangcode like '%'|| :search || '%' or description like '%' || :search || '%') order by gangcode  `

const detailQuery = `SELECT rowid"rowid",empcode "empcode",get_empname(empcode) "empname" ,gangcode "gangcode", empcode_lf "empcode_lf", get_empname(empcode_lf) "empname_lf",ancak "ancak", class "class", year "year",month "month",inputby "inputby", updateby "updateby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from empgang 
where gangcode=:gangcode and month=:month and year=:year order by year,month`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    //binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result
    console.log(binds)
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
    binds.gangcode = (!params.gangcode ? '' : params.gangcode)
    binds.month = (!params.month? '' : params.month)
    binds.year = (!params.year ? '' : params.year)
    //binds.period = (!params.period ? '' : params.period)

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