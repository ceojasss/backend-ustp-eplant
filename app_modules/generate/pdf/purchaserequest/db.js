const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `/* Formatted on 05/02/2024 10:20:17 (QP5 v5.388) */
SELECT a.prcode                                    "prcode",
       TO_CHAR (a.prdate, 'dd-MON-yyyy')           "prdate",
       a.prrequestfrom                             "prrequestfrom",
       a.prnotes                                   "prnotes",
       DECODE (a.prpriority, '1', 'REGULAR')       "prpriority",
       b.itemcode                                  "DETAIL#itemcode",
       b.itemdescription                           "DETAIL#itemdescription",
       b.locationtype                              "DETAIL#locationtype",
       b.locationcode                              "DETAIL#locationcode",
       b.jobcode                                   "DETAIL#jobcode",
       getjob_des (b.jobcode)                      "DETAIL#jobdesc",
       b.quantity                                  "DETAIL#quantity",
       b.approved_quantity                         "DETAIL#approved_quantity",
       realtime_quantity_balance_all (b.itemcode,
                                      EXTRACT (MONTH FROM prdate),
                                      EXTRACT (YEAR FROM prdate),
                                      a.prdate)    "DETAIL#onhand",
       check_os_po (b.itemcode, prdate)            "DETAIL#outstanding",
       uomcode                                     "DETAIL#uomcode",
       TO_CHAR (expectdate, 'dd-mm-yyyy')          "DETAIL#expectdate",
       get_storeinfo (destination)                 "DETAIL#destination",
       b.remarks                                   "DETAIL#keterangan"
  FROM lpr a, lprdetails b
 WHERE 
    a.prcode = b.prcode AND 
    a.prcode = :prcode`

//  const queryStatement = `SELECT * FROM (
//     SELECT ROWNUM as row_num,
//            PRCODE                  "prcode",
//            to_char(PRDATE, 'dd-mm-yyyy')                  "tanggal",
//            PRREQUESTFROM           "gudanguser",
//            PRNOTES                 "catatan",
//            PRPRIORITY              "priority",
//            ITEMCODE                "DETAIL#kodebarang",
//            ITEMDESCRIPTION         "DETAIL#namabarang",
//            LOCATIONTYPE            "DETAIL#locationtypecode",
//            LOCATIONCODE            "DETAIL#locationcode",
//            JOBCODE                 "DETAIL#jobcode",
//            getjob_des (jobcode)    "DETAIL#deskripsi",
//            APPROVED_QUANTITY       "DETAIL#jmldiminta",
//            ONHAND "DETAIL#onhand",
//            OutStanding "DETAIL#outstanding",
//            REPLACE (
//                SMIN
//             || '|'
//             || SMAX
//             || '|'
//             || CASE
//                    WHEN   NVL (approved_quantity, 0)
//                         + NVL (onhand, 0)
//                         + NVL (outstanding, 0) >
//                         smax
//                    THEN
//                        'OVER'
//                    WHEN   NVL (approved_quantity, 0)
//                         + NVL (onhand, 0)
//                         + NVL (outstanding, 0) <
//                         smin
//                    THEN
//                        'REORDER'
//                    WHEN   NVL (approved_quantity, 0)
//                         + NVL (onhand, 0)
//                         + NVL (outstanding, 0) BETWEEN smin
//                                                    AND smax
//                    THEN
//                        'BUFFER'
//                    ELSE
//                        NULL
//                END,
//             '||',
//             '')                 minmaxdesc,
//            UOMCODE "DETAIL#satuanukuran",
//            EXPECTDATE "DETAIL#tanggalperlu",
//            DAYSIV "DETAIL#daysiv",
//            destination             "DETAIL#fr",
//            REMARKS "DETAIL#keterangan"
//     FROM (SELECT a.prcode,
//             a.prdate,
//             a.PRPRIORITY,
//             a.prrequestfrom,
//             a.prnotes,
//             b.itemcode,
//             b.itemdescription,
//             b.remarks,
//             b.locationtype,
//             b.locationcode,
//             b.jobcode,
//             b.approved_quantity,
//             b.uomcode,
//             b.expectdate,
//             get_storeinfo (destination)                 destination,
//             prdate - sivdate                            daysiv,
//             realtime_quantity_balance_all (b.itemcode,
//                                            EXTRACT (MONTH FROM prdate),
//                                            EXTRACT (YEAR FROM prdate),
//                                            a.prdate)    onhand,
//             check_os_po (b.itemcode, prdate)            outstanding,
//             smin,
//             smax
//        FROM lpr                a,
//             lprdetails         b,
//             (  SELECT stockcode itemcode, MAX (sivdate) sivdate
//                  FROM siv     s,
//                       sivdetails d,
//                       lpr     p,
//                       lprdetails pd
//                 WHERE     s.sivcode = d.sivcode
//                       AND sivdate <= prdate
//                       AND pd.prcode = p.prcode
//                       AND stockcode = itemcode
//              GROUP BY stockcode) z,
//             purchaseitem_minmax m
//       WHERE     a.prcode = b.prcode
//             AND a.prcode = :prcode
//             AND b.itemcode = z.itemcode(+)
//             AND b.itemcode = m.itemcode(+))
// ) WHERE row_num <= 10
// `


const fetchData = async function (users, find, callback) {
    let result

    binds = {}
    binds.find = find
    try {
        result = await database.fetchTemporaryData(users, queryStatement, binds)
    } catch (error) {
        callback(error, '')
    }
    callback('', result)
}


const fetchDataDynamic = async function (users, find, callback) {
    
    binds= {}
    binds.prcode = (!find.prcode ? '' : find.prcode)
    
    let result, error

    
    try {
        result = await database.fetchTemporaryData(users, queryStatement, binds)

    } catch (errors) {
        console.log('error fetch', errors.message)
        error = errors.message
        //callback(error, '')
    }


    callback(error, result)
}


module.exports = {
    fetchDataDynamic
    , fetchData
}
