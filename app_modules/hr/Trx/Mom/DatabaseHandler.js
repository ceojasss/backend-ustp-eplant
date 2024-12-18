const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `

const baseQuery = `select 
ROWID "rowid",
TDATE "tdate", 
TTIME "ttime", 
AREA "area", 
LOCATION "location", 
AGENDA "agenda", 
ATTENDEE "attendee", 
SUMMARY_MOM "summary_mom", 
FOTO1 "foto1", 
FOTO2 "foto2", 
FOTO3 "foto3", 
FOTO4 "foto4", 
FOTO5 "foto5", 
INPUTBY "inputby", 
INPUTDATE "inputdate", 
UPDATEBY "updateby", 
UPDATEDATE "updatedate", 
TID "tid" 
from mom
WHERE           
(TDATE LIKE UPPER('%'||: search || '%')
OR TTIME LIKE UPPER ( '%' ||: search || '%' ))`





const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}

    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        //console.log(result)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}




module.exports = {
    fetchDataHeader
}


