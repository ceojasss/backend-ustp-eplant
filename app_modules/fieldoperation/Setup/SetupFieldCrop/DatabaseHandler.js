const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')


const baseQuery = `SELECT ROWID "rowid",FIELDCODE "fieldcode", DESCRIPTION "description",estatecode "estatecode",divisioncode "divisioncode",
PLANTINGDISTANCE "plantingdistance#code", BLOCKID "blockid#code", CROPTYPE "croptype", 
CARRYDISTANCE "carrydistance", PLANTINGPOINTNUM "plantingpointnum", INACTIVE "inactive",
 to_char(INACTIVEDATE,'dd-mm-yyyy') "inactivedate",INTIPLASMA "intiplasma", BREEDER "breeder", 
 to_char(HARVCOMMDATE,'dd-mm-yyyy')  "harvcommdate",to_char(plantingdate,'dd-mm-yyyy')  "plantingdate",
   to_char(LASTTREESCENCUSDATE ,'dd-mm-yyyy')  "lasttreescencusdate", NORMALORIGINALTRESS "normaloriginaltress",
    NORMALSUPPLYINGTREES "normalsupplyingtrees", PRODCTIVEORIGINAL "prodctiveoriginal",
     UNPRODUCTIVE "unproductive", PRODUCTIVESUPPLIYING "productivesuppiying",Progeny "progeny",plantingmaterial "plantingmaterial",standperhect "standperhect",
      UNPRODUCTIVESUPPLIYING "unproductivesuppliying", ABNORMALTREES "abnormaltrees",
       ABNORMALDOYONG "abnormaldoyong",to_char(firstharvest ,'dd-mm-yyyy')  "firstharvest",
       inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from fieldcrop` 




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


