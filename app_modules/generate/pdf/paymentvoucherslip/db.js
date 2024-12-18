const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `SELECT vouchertype
"vouchertype",
vouchercode
"vouchercode",
bankcode
"bankcode",
GETLOC_DES (BANKCODE) "bankname",
chequenumber
"chequenumber",
TO_CHAR (datecreated, 'DD')
|| ' '
|| TRIM (TO_CHAR (datecreated, 'MONTH'))
|| ' '
|| TO_CHAR (datecreated, 'YYYY')
"datecreated",
totalamount
"totalamount",
currency
"currency",
rate
"rate",
locationtype "DETAIL#locationtype",
locationcode "DETAIL#locationcode",
CASE WHEN locationtype IN ('AP', 'CA') THEN locationtype ELSE '' END
"DETAIL#locationtype_x",
CASE WHEN locationtype IN ('AP', 'CA') THEN LOCATIONCODE ELSE '' END
"DETAIL#locationcode_x",
jobcode
"DETAIL#account",
amount
"DETAIL#amount",
DECODE (currency,
'IDR', TO_CHAR (amount, '999,999,999,999,999'),
TO_CHAR (amount, '999,999,999,999,999.99'))
"DETAIL#amount_char",
REFERENCE
"DETAIL#reference",
remarks
"DETAIL#remarks",
applied
"DETAIL#applied",
volume
"DETAIL#volume",
cashflowcode "DETAIL#cfcode"
FROM rpt_payment `

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

    binds = {}
    binds.find = find



    const fillTempStatement = `begin rpt_paymnent_prod_r01_draft (1,:find); end;`

    try {
        //fetchFromTempData = async (users, fillTempStatement, statement, bindsFill = [], BindsSt = []) => {
        result = await database.fetchFromTempData(users, fillTempStatement, queryStatement, bindsFill, find)
        //    result = await database.fetchTemporaryData(users, queryStatement, find)

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
