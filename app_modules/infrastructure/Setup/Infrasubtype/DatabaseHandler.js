const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `SELECT ROWID "rowid",IFTYPE "iftype", IFSUBTYPE "ifsubtype", 
IFSUBTYPENAME "ifsubtypename" from INFRASTRUCTURESUBTYPE  order by iftype`;



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


