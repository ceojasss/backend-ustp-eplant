const _ = require('lodash')
// const database = require('../../../../oradb/dbHandler')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `

const baseQuery = `select 
ROWID "rowid",
BATCHNO "batchno", 
to_char(DATECREATED,'dd-mm-yyyy') "datecreated", 
datepost "datepost",
NUMBERJOURNAL "numberjournal", 
CURRENCY "currency", 
DESCRIPTION "description", 
TOTALAMOUNT "totalamount", 
FINANCIALYEAR "financialyear", 
PERIODNO "periodno",
inputby "inputby", 
status_transfer "status_transfer",
process_flag "process_flag",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", 
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
FROM batch where (batchno like '%'|| :search || '%' or description like '%' || :search || '%'
or periodno like '%' || :search || '%' or financialyear like '%' || :search || '%') and 
TO_CHAR (datecreated, 'mmyyyy') =
 decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
 TO_CHAR (datecreated, 'mmyyyy')) order by batchno`



const fetchdata = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */
    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    // binds.periodno = (!params.periodno? '' : params.periodno)
    // binds.financialyear = (!params.financialyear ? '' : params.financialyear)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    
    let result
    try {
        // result = await database.siteWithDefExecute(users, routes, baseQuery, binds)
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)
        // console.log(result)
    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

module.exports = {
    fetchdata
}



