const _ = require('lodash')
const database = require('../../../oradb/dbHandler')

const baseQuery = `
SELECT 
       ROWID                                  "rowid",
       ID_SPKL                                "id_spkl",
       EMPCODE                              "empcode",
       get_empname (empcode)                  "empnamedisplayonly#code",
       get_empposname (empcode)               "jabatandisplayonly#code",
       DIV_ID                                 "div_id",
       to_char(SPKL_DATE, 'dd-mm-yyyy')                              "spkl_date",
       to_char(SPKL_HOUR_START , 'hh24:mi')                      "spkl_hour_start",
       to_char(SPKL_HOUR_END , 'hh24:mi')                       "spkl_hour_end",
       REMARKS                                "remarks",
       key_spkl                               "key_spkl",
       Approvedby1                            "Approvedby1",
       to_char(Approvedate1, 'dd-mm-yyyy')                           "Approvedate1",
       Approvedby2                            "Approvedby2",
       to_char(Approvedate2, 'dd-mm-yyyy')                           "Approvedate2",
       Approvedby3                            "ApprovedBy3",
       to_char(Approvedate3, 'dd-mm-yyyy')                           "Approvedate3",
       inputby                                "inputby",
       TO_CHAR (inputdate, 'dd-mm-yyyy')      "inputdate",
       updateby                               "updateby",
       TO_CHAR (updatedate, 'dd-mm-yyyy')     "updatedate"
  FROM hr_spkl
 WHERE empcode = :empcode order by SPKL_DATE asc
 `


const fetchdata = async function (users, route, callback) {


binds = {}
binds.empcode = users.empcode

let result


console.log('users : ',users.empcode);


    try {
        result = await database.siteWithDefExecute(users, route, baseQuery, binds)

        console.log('result : ',result)

    } catch (error) {
        console.log('db error :', error.message)

        callback(error.message, '')
    }

    callback('', result)
}




module.exports = {
    fetchdata
}


