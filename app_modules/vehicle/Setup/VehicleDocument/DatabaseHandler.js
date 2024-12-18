const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `


const baseQuery = `
 select v.ROWID "rowid",VEHICLECODE "vehiclecode", to_char(taxexpdate, 'dd-mm-yyyy') "taxexpdate",REGISTRATIONNO "registrationno", 
v.VEHICLEGROUPCODE "vehiclegroupcode#code", g.description "vehiclegroupcode#description",
g.units "vehiclegroupcode#units", FIXEDASSETCODE "fixedassetcode",
v.DESCRIPTION "description", MAKE "make", MODEL "model", YEAR "year",decode(OWNERSHIP,'0','Internal','1','External','2','Sewa') "ownership_desc",ownership "ownership",
to_char(DATEPURCHASE, 'dd-mm-yyyy') "datepurchase", PURCHASECOST "purchasecost", CHASISNO "chasisno", ENGINENO "engineno",
ROADTAXNO "roadtaxno", to_char(ROADTAXEXPDATE,'dd-mm-yyyy') "roadtaxexpdate", ROADTAXAMOUNT "roadtaxamount", 
INSURANCEPOLICYNO "insurancepolicyno", INSURANCECOMPANY "insurancecompany", 
to_char(INSURANCEEXPDATE, 'dd-mm-yyyy') "insuranceexpdate", PREMIUM "premium", AMOUNTINSURED "amountinsured",
POLICYTYPE "policytype", CONTACTNAME "contactname", CONTACTTEL "contacttel", CONTACTFAX "contactfax", 
CONTACTEMAIL "contactemail", PICTURE "picture", CONTROLJOB "controljob", ASSIGN_TO "assign_to", UOM "uom",
INACTIVE "inactive", to_char(INACTIVEDATE,'dd-mm-yyyy') "inactivedate", NORMA "norma", v.INPUTBY "inputby", to_char(v.INPUTDATE, 'dd-mm-yyyy hh24:mi') "inputdate", 
v.UPDATEBY "updateby", to_char(v.UPDATEDATE, 'dd-mm-yyyy hh24:mi') "updatedate", NORMA_X "norma_x", SUBGROUPCODE "subgroupcode#code", s.description "subgroupcode#description", SERIALNO "serialno"
from vehicle v, vehiclegroup g,vehiclesubgroup s  
where v.VEHICLEGROUPCODE= g.VEHICLEGROUPCODE(+) and v.subgroupcode=s.VEHICLESUBGROUPCODE(+) and units != 'HM' and inactivedate is null
order by "vehiclecode"`





const fetchdata = async function (users, route, callback) {

    binds = {}

    let result

    // console.log(route)

    try {
        result = await database.siteWithDefExecute(users, route, baseQuery, binds)

        //console.log(result)

    } catch (error) {
        console.log('db error :', error.message)

        callback(error.message, '')
    }

    callback('', result)
}




module.exports = {
    fetchdata
}


