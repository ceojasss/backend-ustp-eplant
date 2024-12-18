const _ = require('lodash')
const database = require('../../../oradb/dbHandler')



const baseQuery = `SELECT get_empname (empcode)                    "empnamedisplayonly",
empcode                                  "empcode",
get_empposname (empcode)                 "jabatandisplayonly",
div_id                                   "div_id",
nospd                                    "nospd",
saldo                                    "saldo",
jmlcuti                                  "jmlcuti",
TO_CHAR (tglawal, 'dd-mm-yyyy')          "tglawal",
TO_CHAR (tglakhir, 'dd-mm-yyyy')         "tglakhir",
sisa                                     "sisa",
approvedby1                              "approvedby1",
TO_CHAR (approvedate1, 'dd-mm-yyyy')     "approvedate1",
status_cuti                              "statuscuti",
inputby                                  "inputby",
TO_CHAR (inputdate, 'dd-mm-yyyy')        "inputdate",
updateby                                 "updateby",
TO_CHAR (updatedate, 'dd-mm-yyyy')       "updatedate"
FROM hr_dayoff
WHERE empcode = :empcode
ORDER BY inputdate desc
`

const fetchdata = async function (users, route, callback) {

    binds = {}
    binds.empcode = users.empcode

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


