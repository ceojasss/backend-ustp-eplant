const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = ` SELECT ROWID "rowid",BANKCODE "bankcode",
BANKNAME "bankname",
CONTROLACCOUNT "controlaccount#code",
getjob_des(CONTROLACCOUNT) "controlaccount#description",
BANKACCOUNTCODE "bankaccountcode",AUTHORIZEDSIG1 "authorizedsig1",
AUTHORIZEDSIG2 "authorizedsig2",
AUTHORIZEDSIG3 "authorizedsig3",
CURRENCY "currency",to_char(DATEREGISTERED,'dd-mm-yyyy')    "dateregistered",
CITY "city", postalcode "postalcode"
FROM BANK`



const fetchBanks = async function (users, route, callback) {
    console.log('DATABASE HANDLER cashbank')
    binds = {}

    let result

    // console.log(route)

    try {
        result = await database.siteWithDefExecute(users, route, baseQuery, binds)
        console.log('hasil Database Handler Cashbank',result)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}



const fetchDynamic = async function (users, route, callback) {

    binds = {}

    let result

    // console.log(route)

    try {
        result = await database.DynamicTable(users, route, baseQuery, binds)
        //console.log(result)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}



module.exports = {
    fetchBanks, fetchDynamic
}
