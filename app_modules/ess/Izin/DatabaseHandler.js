const _ = require('lodash')
const database = require('../../../oradb/dbHandler')



const baseQuery = `
SELECT a.id_leave"id_leave",
a.empcode"empcode",
get_empname (a.empcode)"empnamedisplayonly",
get_empposname (a.empcode)"jabatandisplayonly",
a.div_id"div_id",
CASE
WHEN leave_type = 0 THEN 'TERLAMBAT MASUK KANTOR'
WHEN leave_type = 1 THEN 'MENINGGALKAN KANTOR'
WHEN leave_type = 2 THEN 'DINAS DALAM'
ELSE NULL
END"leave_type",
TO_CHAR (a.leave_date, 'dd-mm-yyyy')"leave_date",
TO_CHAR (a.leave_hour_start, 'hh24:mi')"leave_hour_start",
TO_CHAR (a.leave_hour_end, 'hh24:mi')"leave_hour_end",
a.remarks"remarks",
a.approvedby1"approvedby1",
TO_CHAR (a.approvedate1, 'dd-mm-yyyy hh24:mi')"approveddate1",
a.approvedby2"approvedby2",
TO_CHAR (a.approvedate2, 'dd-mm-yyyy hh24:mi')"approveddate2",
a.approvedby3"approvedby3",
TO_CHAR (a.approvedate3, 'dd-mm-yyyy hh24:mi')"approveddate3",
a.inputby"inputby",
TO_CHAR (a.inputdate, 'dd-mm-yyyy hh24:mi')"inputdate",
a.updateby"updateby",
TO_CHAR (a.updatedate, 'dd-mm-yyyy hh24:mi')"updatedate",
a.status_ijin"status_izin"
FROM hr_short_leave a
WHERE a.empcode = :empcode
ORDER BY a.leave_date desc
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


