const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = ` select m.rowid "rowid",machinecode "machinecode",m.description "description",registrationno "registrationno",make "make",model "model",otherdescription "otherdescription",chasisno "chasisno",year "year",
fixedassetcode "fixedassetcode",decode(OWNERSHIP,'0','Internal','1','External','2','Sewa') "ownership_desc",ownership "ownership", to_char(datepurchase,'dd-mm-yyyy') "datepurchase",purchasecost "purchasecost",
picture "picture",NVL(station_stationcode,'') "station_stationcode#code",NVL(parametervalue,'') "station_stationcode#desc", controljob "controljob",
m.inactive "inactive", to_char(m.inactivedate,'dd-mm-yyyy') "inactivedate", norma "norma", m.groupcode "groupcode#code",mg.description "groupcode#description",
norma_x "norma_x", divisioncode "divisioncode#code", nomachine "nomachine", other_desc "other_desc",
m.inputby "inputby", to_char(m.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", m.updateby "updateby", to_char(m.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from machine m , machinegroup mg,parametervalue p where parametercode = 'MAC01' and station_stationcode= parametervaluecode  and  m.groupcode= mg.groupcode`



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


