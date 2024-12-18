const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = ` select ROWID "rowid",STORECODE "storecode", STORENAME "storename",
REMARKS "remarks", INACTIVE "inactive", to_char(INACTIVEDATE,'dd-mm-yyyy') "inactivedate",
ASSIGN_TO "assign_to", INPUTBY "inputby", to_char(INPUTDATE, 'dd-mm-yyyy hh24:mi') "inputdate", 
UPDATEBY "updateby", to_char(UPDATEDATE, 'dd-mm-yyyy hh24:mi') "updatedate" from storeinfo order by storecode
 `


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


