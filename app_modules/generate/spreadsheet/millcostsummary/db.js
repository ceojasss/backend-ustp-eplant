const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `select fiscalyear,jobcode,jobdescription, sum(amount) as amount
from v_millcost_detail
where fiscalyear=:P_FISCALYEAR
and period between  :P_PERIOD1 and :P_PERIOD2
group by fiscalyear,jobcode,jobdescription
order by jobcode`




const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


    // let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['P_FISCALYEAR', 'P_PERIOD1', 'P_PERIOD2'])

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
