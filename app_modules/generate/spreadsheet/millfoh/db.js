const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement =`  SELECT   a.JOBCODE, b.JOBDESCRIPTION, SUM (a.TVALUE) TVALUE
FROM   costbook a, job b, costcenter c
WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:month1, 2, 0) || :year, 'ddmmyyyy')
                 AND  LAST_DAY (TO_DATE ('01' || LPAD (:month2, 2, 0) || (:year), 'ddmmyyyy'))
       AND a.JOBCODE = b.JOBCODE
       AND targetcode = costcentercode
       AND targettype = 'GC'
       AND allocationtype = '3'
       --and referenceno  not like 'CA%'
       AND a.jobcode NOT LIKE 'A%'
GROUP BY   a.JOBCODE, b.JOBDESCRIPTION`


const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


    // let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['month1', 'year', 'month2'])

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
