const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `


const baseQuery = `
select  
    ROWID "rowid", 
    GRADEID "gradeid", 
    SALARYAMT "salaryamt",
    ADDSAL1 "addsal1",
    ADDSAL2 "addsal2",
    ADDSAL3 "addsal3",
    ADDSAL4 "addsal4",
    ADDSAL5 "addsal5",
    EMPTYPE "emptype",
    INPUTBY "inputby", 
    to_char(INPUTDATE,'dd-mm-yyyy hh24:mi') "inputdate", 
    UPDATEBY "updateby", 
    to_char(UPDATEDATE,'dd-mm-yyyy hh24:mi') "updatedate"
FROM empsalgrade
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


