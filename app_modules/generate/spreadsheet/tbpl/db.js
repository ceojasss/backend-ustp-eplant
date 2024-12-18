const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = ` SELECT   NO, jobcode, desc1, desc2, desc3, desc4, desc5, desc6, openbaldb,
openbalcr * -1 openbalcr, movementdb, movementcr * -1 movementcr,
closebaldb, closebalcr * -1 closebalcr, TYPE
FROM rpt_trial_balance_history_pl
WHERE NOT (    openbaldb = 0
     AND openbalcr = 0
     AND movementdb = 0
     AND movementcr = 0
     AND closebaldb = 0
     AND closebalcr = 0
     AND TYPE = 'D'
    )
AND MONTH = :PMONTH
AND YEAR = :PYEAR                                     
ORDER BY NO`


const queryStatement2 = `SELECT SUM (openbaldb), SUM (openbalcr * -1), SUM (movementdb),
SUM (movementcr * -1), SUM (closebaldb) sum_closebaldb,
SUM (closebalcr * -1) sum_closebalcr
FROM rpt_trial_balance_history_pl
WHERE jobcode IS NOT NULL AND MONTH = :PMONTH AND YEAR = :PYEAR`




const fetchDataDynamic = async function (users, find, callback) {
    let result, result2, error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


    // let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['PMONTH', 'PYEAR'])

    try {
        result = await database.executeStmt(users, queryStatement, bindStatement)
        result2 = await database.executeStmt(users, queryStatement2, bindStatement)

    } catch (errors) {

        error = errors
    }


    callback(error, result, result2)
}


module.exports = {
    fetchDataDynamic
}
