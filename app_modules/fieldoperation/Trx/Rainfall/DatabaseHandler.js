const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT DISTINCT DEPARTMENTNAME       "departmentname",
O.DIVISIONCODE       "divisioncode",
DIVISIONNAME         "divisionname",
AWSTYPE              "awstype",
AWS_BLOCK            "aws_block",
YEAR "aws_year",
O.DEPARTMENTCODE     "estatecode"
FROM epms_ustp.aws_location A, ORGANIZATION O
WHERE     site = getcompany ('COMP_CODE')
AND O.DIVISIONCODE = A.DIVISIONCODE
AND FUNCTIONCODE = 'E'
AND year =:year
ORDER BY O.DEPARTMENTCODE ,O.DIVISIONCODE
`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid "rowid",
estatecode "estatecode", divisioncode "divisioncode",to_char(raindate,'dd-mm-yyyy') "raindate",rainfallqty "rainfallqty", to_char(rainstart,'dd-mm-yyyy') "rainstart", to_char(rainend,'dd-mm-yyyy') "rainend", remark "remark" from rainfall 
where 
estatecode=:estatecode and 
divisioncode=:divisioncode and 
to_char(raindate,'mmyyyy') = nvl(to_char(TO_DATE(:period, 'MM/YYYY'),'mmyyyy'),to_char(raindate,'mmyyyy')) ORDER BY raindate`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    // binds.limitsize = (!params.size ? 0 : params.size)
    // binds.page = (!params.page ? 1 : params.page)
    // binds.search = (!params.search ? '' : params.search)
    binds.year = (!params.year ? '' : params.year)
    // binds.year = (!params.year ? '' : params.year)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, baseQuery, binds)

        // console.log(result)
    } catch (error) {
        console.log('err', error)

        callback(error, '')
    }



    callback('', result)
}
const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */
    binds.estatecode = (!params.estatecode ? '' : params.estatecode)
    binds.divisioncode = (!params.divisioncode ? '' : params.divisioncode)
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

