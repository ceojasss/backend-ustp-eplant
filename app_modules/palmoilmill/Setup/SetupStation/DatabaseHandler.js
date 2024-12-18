const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = ` select ROWID "rowid",STATIONCODE "stationcode", DESCRIPTION "description", JOBCODE "jobcode",
 PCT_CPO "pct_cpo", PCT_PK "pct_pk", to_char(inactivedate,'dd-mm-yyyy') "inactivedate", STGROUP "stgroup",inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
 updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"  FROM STATION `


const fetchdata = async function (users, route, callback) {

    binds = {}

    let result

    // console.log(route)

    try {
        result = await database.siteWithDefExecute(users, route, baseQuery, binds)
        //console.log(result)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}




module.exports = {
    fetchdata
}

