const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `

const baseQuery = `select 
ROWID "rowid",
GROUPID "groupid", 
DESCRIPTION "description", 
UNIT "unit", 
decode(DEPRMETHODID,0,'No',1,'Yes') "deprmethodid", 
PERCENTDEPRERATE "percentdeprerate",
FIXEDASSETACCOUNT "fixedassetaccount#code", 
getjob_des(FIXEDASSETACCOUNT) "fixedassetaccount#description", 
ACUMDEPRECIATACCOUNT "acumdepreciataccount#code",
getjob_des(ACUMDEPRECIATACCOUNT) "acumdepreciataccount#des", 
CIPACCOUNTCODE "cipaccountcode#code", 
getjob_des(CIPACCOUNTCODE) "cipaccountcode#description", 
GROUPPARENT "groupparent", 
inputby "inputby",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", 
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate", 
decode(ISDEPRECIABLE,0, 'No', 1, 'Yes') "isdepreciable", 
INACTIVEMARK "inactivemark",
SALESPROCEED "salesproceed", 
COSTREMOVAL "costremoval#code", 
getjob_des(COSTREMOVAL) "costremoval#description", 
DEPREXPACCOUNT "deprexpaccount#code", 
getjob_des(DEPREXPACCOUNT) "deprexpaccount#description", 
NBRETIREACCOUNT "nbretireaccount" 
from fagroup order by GROUPID`







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


