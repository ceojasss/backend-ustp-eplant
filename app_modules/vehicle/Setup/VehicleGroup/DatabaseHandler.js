const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')



const baseQuery = `  SELECT ROWID "rowid",VEHICLEGROUPCODE "vehiclegroupcode",DESCRIPTION "description",UNITS "units#code",get_uomdesc(UNITS) "units#description",
WORKSHOPFACTOR "worshopfactor",COSTPERVEHICLE "costpervehicle",
NOOFVEHICLE "noofvehicle",INPUTBY "inputby", to_char(INPUTDATE, 'dd-mm-yyyy hh24:mi') "inputdate", 
UPDATEBY "updateby", to_char(UPDATEDATE, 'dd-mm-yyyy hh24:mi') "updatedate" FROM VEHICLEGROUP order by vehiclegroupcode
`




const fetchdata = async function (users, route, callback) {

    binds = {}

    let result

    // console.log(route)

    try {
        result = await database.siteWithDefExecute(users, route, baseQuery, binds)
        //console.log(result)
    } catch (error) {
        callback(error.message, '')
    }

    callback('', result)
}




module.exports = {
    fetchdata
}


