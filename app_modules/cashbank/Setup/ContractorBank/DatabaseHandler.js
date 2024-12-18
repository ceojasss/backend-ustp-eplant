const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `SELECT ROWID "rowid", 
CONTRACTORCODE "contractorcode", 
BANKNAME "bankname", BANKACCNO "bankaccno",
to_char(LASTTRANSACTION,'dd-mm-yyyy') "lasttransaction", 
ACCNONAME "accnoname", CURRENCY "currency", ADDRESS "address", 
inputby "inputby",to_char(inputdate,'dd-mm-yyyy') "inputdate", 
updateby "updateby", to_char(updatedate,'dd-mm-yyyy') "updatedate"
FROM contractorbank`


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


