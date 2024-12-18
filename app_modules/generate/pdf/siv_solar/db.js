const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')


const queryStatement =`SELECT DISTINCT
a.sivcode                                                              "sivcode",
TO_CHAR (a.SIVDATE, 'dd-mm-yyyy')                                      "tanggal",
a.storecode                                                            "gudang",
m.mrcode                                                               "mrcode",
e.MRREQUESTFROM                                                        "peminta",
s.stockcode                                                            "DETAIL#kodebarang",
p.itemdescription                                                      "DETAIL#namabarang",
s.locationtype                                                         "DETAIL#locationtype",
s.locationcode                                                         "DETAIL#locationcode",
s.jobcode                                                              "DETAIL#jobcode",
md.quantity                                                            "DETAIL#jumlahdiminta",
m.qty - (m.QTYISSUED + m.QTYOUTSTANDING)                               "DETAIL#sudahkeluar",
s.quantity                                                             "DETAIL#keluarsekarang",
md.quantity-s.quantity                                                 "DETAIL#sisa",
p.UOMCODE                                                              "DETAIL#uom",
s.kmhm                                                                 "DETAIL#kmhm",
md.remarks                                                            "DETAIL#remarks",
TO_CHAR (SUM (md.quantity) OVER (), 'FM999,999,990.00')       "sum_jumlahdiminta",
TO_CHAR (SUM (m.qty - (m.QTYISSUED + m.QTYOUTSTANDING) ) OVER (), 'FM999,999,990.00')        "sum_sudahkeluar",
TO_CHAR (SUM (s.quantity) OVER (), 'FM999,999,990.00')        "sum_keluarsekarang",
TO_CHAR (SUM (md.quantity-s.quantity ) OVER (), 'FM999,999,990.00')        "sum_sisa"
FROM siv         a,
mrsiv       m,
mr          e,
sivdetails  s,
purchaseitem p,
mrdetails   md
WHERE   a.sivcode = m.sivcode
AND a.sivcode = s.sivcode
AND e.mrcode = m.mrcode
AND a.sivcode = s.sivcode
AND s.stockcode = p.itemcode
AND m.mrcode = md.mrcode
and md.itemcode = s.stockcode
AND md.locationcode = s.locationcode
and md.locationtype = s.locationtype
and md.jobcode = s.jobcode
AND s.stockcode  = m.itemcode
AND s.locationcode = m.locationcode
and s.locationtype = m.locationtype
and s.jobcode = m.jobcode
and   a.sivcode = 'GCM/SIV/1902/04825' 
ORDER BY s.stockcode ASC
`

// siv code yang 1 data sama semua = 
                                //   GCM/SIV/2202/02551
                                //   GCM/SIV/2201/01304

// siv code yang beda beda = 
                //GCM/SIV/1905/10405
                //GCM/SIV/1902/04825	

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
    let result, error

    //    console.log(find)

    // console.log('site D', '<' + users.site + '>')
    /* 
        binds = {}
        binds.find = find
     */
    try {
        result = await database.fetchTemporaryData(users, queryStatement, find)

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
