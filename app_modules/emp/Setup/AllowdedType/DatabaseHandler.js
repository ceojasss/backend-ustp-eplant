const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `


const baseQuery = `
select  
ROWID "rowid", 
ALLOWDEDCODE "allowdedcode", 
ALLOWANCE "allowance",
DESCRIPTION "description",
FORMULA "formula",
JOBCODE "jobcode",
INCOMETAX "incometax",
DC_IC "dc_id",
PAYROLLLISTCOLUMN "payrolllistcolumn",
EMPTYPE "emptype",
DEBTNO "debtno",
VIEW_SLIP "view_slip",
COMP_ID "comp_id",
SITE_ID "site_id",
INPUTBY "inputby", 
to_char(INPUTDATE,'dd-mm-yyyy hh24:mi') "inputdate", 
UPDATEBY "updateby", 
to_char(UPDATEDATE,'dd-mm-yyyy hh24:mi') "updatedate"
FROM allowded
`





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


