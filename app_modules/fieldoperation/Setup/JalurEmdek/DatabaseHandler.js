const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT DISTINCT  b.rowid "rowid",
b.blockid  "blockid",
b.concessionid "concessionid",
b.divisioncode "divisioncode",
b.divisioncode_plasma "divisioncode_plasma",
b.estatecode "estatecode"
FROM blockorg b, jaluremdek j 
WHERE     b.blockid = j.blockid
AND inactivedate IS NULL
AND (   b.blockid LIKE '%' || :search || '%'
OR b.estatecode LIKE '%' || :search || '%'
OR b.updateby LIKE '%' || :search || '%'
OR b.inputby LIKE '%' || :search || '%')
ORDER BY b.estatecode`

/**
 * ! change query table detail
 */
const detailQuery = `  select rowid "rowid",
tid "tid",
blockid "blockid",
no_tlp "no_tlp",
baris "baris",
pokok_mekanis "pokok_mekanis",
pokok_manual "pokok_manual",
arah_belok "arah_belok",
inputby "inputby",
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", 
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"   
from jaluremdek
WHERE     blockid = :blockid
ORDER BY blockid`


/**
 * ! change query table detail
 */
// const detailByDateQuery = `SELECT "rowid",
// "tid",
// "blockid",
// "vehdate",
// "description",
// "locationtype#code",
// "locationtype#description",
// "locationcode#code",
// "locationcode#description",
// "loadtype#code",
// "loadtype#description",
// "jobcode#code",
// "jobcode#description",
// "amount",
// "from_time",
// "to_time",
// "from_qty",
// "status_transfer",
// "to_qty",
// "quantity",
// "units",
// NVL (quarry, '')     "quarry#code",
// b.description        "quarry#description",
// xx."inputby",
// xx."inputdate",
// xx."updateby",
// xx."updatedate",
// "uom",
// "sivcode",
// "siv_jobcode",
// "siv_stockcode",
// "siv_qty",
// "siv_locationcode",
// 'true' "datelimit"
// FROM (  SELECT a.ROWID
//               "rowid",
//           tid
//               "tid",
//           blockid
//               "blockid",
//           TO_CHAR (vehdate, 'dd-mm-yyyy')
//               "vehdate",
//           a.description
//               "description",
//           locationtype
//               "locationtype#code",
//           NVL (get_locationdesc (locationtype), 'NA')
//               "locationtype#description",
//           locationcode
//               "locationcode#code",
//           NVL (getloc_des (locationcode), 'NA')
//               "locationcode#description",
//           NVL (loadtype, 'NA')
//               "loadtype#code",
//           GET_LOADTYPEDESC (NVL (loadtype, 'NA'))
//               "loadtype#description",
//           jobcode
//               "jobcode#code",
//           NVL (getjob_des (jobcode), 'NA')
//               "jobcode#description",
//           amount
//               "amount",
//           TO_CHAR (from_time, 'hh24:mi')
//               "from_time",
//           TO_CHAR (to_time, 'hh24:mi')
//               "to_time",
//           status_transfer
//               "status_transfer",
//           uom
//               "uom",
//           sivcode
//               "sivcode",
//           siv_jobcode
//               "siv_jobcode",
//           siv_stockcode
//               "siv_stockcode",
//           siv_qty
//               "siv_qty",
//           siv_locationcode
//               "siv_locationcode",
//           a.from_qty
//               "from_qty",
//           a.to_qty
//               "to_qty",
//           quantity
//               "quantity",
//           units
//               "units",
//           inputby
//               "inputby",
//           TO_CHAR (inputdate, 'dd-mm-yyyy hh24:mi')
//               "inputdate",
//           updateby
//               "updateby",
//           TO_CHAR (updatedate, 'dd-mm-yyyy hh24:mi')
//               "updatedate",
//           quarry
//      FROM vehicleactivity a
//     WHERE     a.blockid = :blockid
//           AND VEHDATE = TO_DATE ( :period, 'dd-mm-yyyy')
//  ORDER BY a.vehdate, a.from_qty) xx
// LEFT JOIN blockmaster b ON xx.quarry = B.BLOCKID`

// const checkEntry = `  SELECT vehdate "vehdate_date", to_char(vehdate,'dd-mm-yyyy')"vehdate", SUM (COUNT (*)) OVER () "entries"
// FROM vehicleactivity a
// WHERE     a.blockid = :blockid
//      AND TO_CHAR (VEHDATE, 'mmyyyy') =
//          NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'),
//               TO_CHAR (VEHDATE, 'mmyyyy'))
// GROUP BY vehdate ,to_char(vehdate,'dd-mm-yyyy')
// order by vehdate`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)

    let result


    //console.log(binds.search, binds.dateperiode)
    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        // console.log(result)
    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}
const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    /**
   * ! change the parameters according to the table
   */
    binds.blockid = (!params.blockid ? '' : params.blockid)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


    } catch (error) {
        callback(error, '')
    }
    callback('', result)
}

// const fetchDataDetailByDate = async function (users, routes, params, callback) {

//     binds = {}

//     /**
//    * ! change the parameters according to the table
//    */
//     binds.blockid = (!params.blockid ? '' : params.blockid)
//     binds.period = (!params.period ? '' : params.period)

//     let result

//     try {
//         result = await database.siteWithDefExecute(users, routes, detailByDateQuery, binds)


//     } catch (error) {
//         callback(error, '')
//     }
//     callback('', result)
// }



// const fetchCount = async function (users, routes, params, callback) {

//     binds = {}

//     /**
//    * ! change the parameters according to the table
//    */
//     binds.blockid = (!params.blockid ? '' : params.blockid)
//     binds.period = (!params.period ? '' : params.period)

//     let result

//     try {
//         result = await database.siteExecute(users, checkEntry, binds)


//     } catch (error) {
//         callback(error, '')
//     }
//     callback('', result)
// }


module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    // fetchCount,
    // fetchDataDetailByDate
}



