const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const firstQuery = `
/* Formatted on 2018/07/13 15:05 (Formatter Plus v4.8.8) */
SELECT   NO, jobcode, desc1, desc2, desc3, desc4, desc5, desc6, openbaldb,
         openbalcr * -1 openbalcr, movementdb, movementcr * -1 movementcr,
         closebaldb, closebalcr * -1 closebalcr, TYPE
    FROM rpt_trial_balance_history
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
     --AND STATUS = 1
ORDER BY NO`


const secondQuery = `/* Formatted on 2018/07/13 15:06 (Formatter Plus v4.8.8) */
SELECT SUM (openbaldb), SUM (openbalcr * -1), SUM (movementdb),
       SUM (movementcr * -1), SUM (closebaldb) sum_closebaldb,
       SUM (closebalcr * -1) sum_closebalcr
  FROM rpt_trial_balance_history
 WHERE jobcode IS NOT NULL AND MONTH = :PMONTH AND YEAR = :PYEAR`



const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :p_month, :p_year, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :p_month, :p_year, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    


  ///  let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['PMONTH','PYEAR'])

    console.log('bindStatement check : ', bindStatement);


    try {
        result = await database.executeStmt(users, firstQuery, bindStatement)
        secondresult = await database.executeStmt(users, secondQuery, bindStatement)


    } catch (errors) {

        error = errors
    }


    callback(error, result, secondresult)
}


module.exports = {
    fetchDataDynamic
}