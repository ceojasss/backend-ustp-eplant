const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `SELECT a.batchno "batchno",
a.financialyear "financialyear",
to_char(a.totalamount, 'FM999,999,990.00') "totalamount",
SUBSTR (
        REPLACE (
                REPLACE (REPLACE (a.description, CHR (10), ''),
                         CHR (13),
                         ''),
                '''',
                ''),
        1,
        500)                             "description",
a.periodno "periodno",
a.currency "currency",
a.numberjournal "numberjournal",
b.jvno "jvno",
to_char(b.totalamount, 'FM999,999,990.00') "totalamount",
c.locationtype "DETAIL#locationtype",
c.locationtypecode "DETAIL#locationtypecode",
c.jobcode "DETAIL#jobcode",
SUBSTR (
        REPLACE (
                REPLACE (REPLACE (c.remarks, CHR (10), ''),
                         CHR (13),
                         ''),
                '''',
                ''),
        1,
        500)                             "DETAIL#remarks",
to_char(c.debit, '999,999,990.00') "DETAIL#debit",
to_char(c.credit, '999,999,990.00') "DETAIL#credit",
to_char(c.volume, '999,999,990,00') "DETAIL#volume",
b.transactiondate "transactiondate",
d.jobdescription "DETAIL#jobdescription",
c.faktur_pajak "DETAIL#faktur_pajak",
c.faktur "faktur",
c.faktur  ||' '||  c.faktur_pajak        "faktur_gabung"
,
to_char(SUM(c.debit) OVER (), 'FM999,999,990.00') "sum_debit",
to_char(SUM(c.credit) OVER (), 'FM999,999,990.00') "sum_credit",
to_char(SUM(c.volume) OVER (), 'FM999,999,990.00') "sum_volume"
FROM batch         a,
journalvoucher b,
jvdetails     c,
job           d
WHERE     a.batchno = b.batchno
AND a.periodno = a.periodno
AND a.financialyear = a.financialyear
AND b.jvno = c.jvno
AND c.jobcode = d.jobcode
AND b.jvno = 'GCM/JV/0808/00720'
AND rownum <= 11
ORDER BY a.batchno,
b.jvno,
SIGN (c.debit) DESC,
SIGN (c.credit) ASC
`

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
