const _ = require('lodash')
const database = require('../../../oradb/dbHandler')

const baseQuery = `
SELECT ROWID                                  "rowid",
       ID_REQ                                 "id_req",
       EMPCODE                                "empcode",
       get_empname (empcode)                  "empnamedisplayonly#code",
       get_empposname (empcode)               "jabatandisplayonly#code",
       get_empname (empcode)                  "empnamedisplayonly",
       get_empposname (empcode)               "jabatandisplayonly",
       DIV_ID                                 "div_id",
       KODE1                                  "kode1",
       QTY1_R                                 "qty1_r",
       QTY1_A                                 "qty1_a",
       KODE2                                  "kode2",
       QTY2_R                                 "qty2_r",
       QTY2_A                                 "qty2_a",
       KODE3                                  "kode3",
       QTY3_R                                 "qty3_r",
       QTY3_A                                 "qty3_a",
       KODE4                                  "kode4",
       QTY4_R                                 "qty4_r",
       QTY4_A                                 "qty4_a",
       KODE5                                  "kode5",
       QTY5_R                                 "qty5_r",
       QTY5_A                                 "qty5_a",
       KODE6                                  "kode6",
       QTY6_R                                 "qty6_r",
       QTY6_A                                 "qty6_a",
       KODE7                                  "kode7",
       QTY7_R                                 "qty7_r",
       QTY7_A                                 "qty7_a",
       KODE8                                  "kode8",
       QTY8_R                                 "qty8_r",
       QTY8_A                                 "qty8_a",
       KODE9                                  "kode9",
       QTY9_R                                 "qty9_r",
       QTY9_A                                 "qty9_a",
       KODE10                                 "kode10",
       QTY10_R                                "qty10_r",
       QTY10_A                                "qty10_a",
       KODE11                                 "kode11",
       QTY11_R                                "qty11_r",
       QTY11_A                                "qty11_a",
       KODE12                                 "kode12",
       QTY12_R                                "qty12_r",
       QTY12_A                                "qty12_a",
       KODE13                                 "kode13",
       QTY13_R                                "qty13_r",
       QTY13_A                                "qty13_a",
       KODE14                                 "kode14",
       QTY14_R                                "qty14_r",
       QTY14_A                                "qty14_a",
       KODE15                                 "kode15",
       QTY15_R                                "qty15_r",
       QTY15_A                                "qty15_a",
       REMARKS                                "remarks",
       key_req                                "key_req",
       status_req                             "status_req",
       Approvedby1                            "Approvedby1",
       to_char(Approvedate1, 'dd-mm-yyyy')                           "Approvedate1",
       Approvedby2                            "Approvedby2",
       to_char(Approvedate1, 'dd-mm-yyyy')                          "Approvedate2",
       Approvedby3                            "ApprovedBy3",
       to_char(Approvedate1, 'dd-mm-yyyy')                            "Approvedate3",
       inputby                                "inputby",
       TO_CHAR (inputdate, 'dd-mm-yyyy')      "inputdate",
       updateby                               "updateby",
       TO_CHAR (updatedate, 'dd-mm-yyyy')     "updatedate"
  FROM hr_atk
 WHERE empcode = :empcode
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


