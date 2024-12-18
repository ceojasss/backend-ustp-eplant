const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `

const baseQuery = ` select ROWID "rowid",CUSTOMERCODE "customercode", DESCRIPTION "description", ICNO "icno", BANK "bank", 
BANKACCOUNTNO "bankaccountno", ADDRESS "address", COMPANYNO "companyno", NAME "name", BUYER "buyer", 
OWNCOMPANY "owncompany", PROCESSINGRATE "processingrate", SUPPLIER "supplier",
 ADDITIONALCHARGES "additionalcharges", CONTROLJOB "controljob", 
 SLCONTROLJOB "slcontroljob", INACTIVE "inactive", 
 to_char(inactivedate,'dd-mm-yyyy') "inactivedate", NPWP "npwp", TOPCODE "topcode" from customer `






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


