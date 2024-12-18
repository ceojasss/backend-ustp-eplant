const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `select jobcode,jobdescription,grouptype,unitofmeasure 
from job where inactivedate is null 
--and jobcode not like 'A%' 
and jobcode between nvl(:P_JOBCODE,jobcode) and nvl(:P_JOBCODE1,jobcode)
order by jobcode`




const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


    //let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['P_JOBCODE', 'P_JOBCODE1'])

    try {
        result = await database.executeStmt(users,queryStatement, bindStatement)

    } catch (errors) {

        error = errors
    }


    callback(error, result)
}


module.exports = {
    fetchDataDynamic
}
