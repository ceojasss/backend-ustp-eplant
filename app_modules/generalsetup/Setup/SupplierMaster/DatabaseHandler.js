const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `

const baseQuery = `  select ROWID "rowid",  SUPPLIERCODE "suppliercode", SUPPLIERNAME "suppliername", 
CONTROLJOB  "controljob#code",getjob_des(CONTROLJOB) "controljob#description", 
NPWP "npwp" , 
NPKP "npkp",
to_char(DATECREATED,'dd-mm-yyyy') "datecreated",
INACTIVE "inactive" from supplier`




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


