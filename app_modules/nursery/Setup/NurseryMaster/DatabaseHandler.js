const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `SELECT ROWID "rowid",NURSERYCODE "nurserycode", DESCRIPTION "description",
to_char(DATEPLANTED,'dd-mm-yyyy') "dateplanted",
CROP "crop",VARIETAS "varietas",QTYORDERED "qtyordered", 
ESTATECODE "estatecode", DIVISIONCODE "divisioncode", PLOT_CAPACITY "plot_capacity", 
TOTAL_PLOT "total_plot", BLOCKID "blockid", TYPE "type", ORIGIN "origin", 
to_char(DATEPLANTED,'dd-mm-yyyy') "inactivedate",inputby "inputby", 
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", 
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  FROM NURSERY order by nurserycode`


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


