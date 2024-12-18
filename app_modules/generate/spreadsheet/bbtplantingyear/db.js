const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `
SELECT   v.accyear, NVL (TO_CHAR (dateplanted, 'YYYY') , 'N/A') plantingyear, v.jobcode,
v.jobdescription, SUM (amount) amt
FROM v_nursery_detail v, job j, accountcode a
WHERE accyear = :P_YEAR
AND periodseq = :P_MONTH
AND v.jobcode = j.jobcode
AND j.accountcode = a.accountcode
GROUP BY v.accyear,
v.jobcode,
v.jobdescription,
TO_CHAR (dateplanted, 'YYYY')
Order by 2, 3`




const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


  ///  let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['P_YEAR', 'P_MONTH'])

    try {
        result = await database.executeStmt(users, queryStatement, bindStatement)

    } catch (errors) {

        error = errors
    }


    callback(error, result)
}


module.exports = {
    fetchDataDynamic
}