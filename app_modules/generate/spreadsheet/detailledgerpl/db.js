const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `  SELECT 
TDATE,DESCRIPTION,TARGETTYPE,TARGETCODE,
JOBCODE,DEBIT, ABS(CREDIT) CREDIT,BALANCE,REFERENCENO,
SOURCETYPE,SOURCECODE,NO,JOBDESCRIPTION,
OPENINGBALANCE,OPENINGBALANCE  OPBAL  
FROM RPT_DETAIL_LEDGER
WHERE NO <> 1 
   AND SOURCETYPE = NVL(:P_SOURCETYPE,SOURCETYPE)
   AND SOURCECODE LIKE NVL(:P_SOURCECODE,SOURCECODE)||'%'
   AND TARGETTYPE = NVL(:P_TARGETTYPE,TARGETTYPE)
   AND TARGETCODE LIKE NVL(:P_TARGETCODE,TARGETCODE)||'%'
ORDER BY JOBCODE, NO, TDATE,REFERENCENO,SOURCETYPE,SOURCECODE,TARGETTYPE,TARGETCODE`




const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // custom code
    if (find.report === 'M') {
        fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH_PL ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    } else {
        fillStatement = `begin RPT_DETAIL_LEDGER_TODATE_PL ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    }


    let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['P_SOURCETYPE', 'P_SOURCECODE', 'P_TARGETTYPE', 'P_TARGETCODE'])

    try {
        result = await database.fetchFromTempData(users, fillStatement, queryStatement, bindsFills, bindStatement)

    } catch (errors) {

        error = errors
    }


    callback(error, result)
}


module.exports = {
    fetchDataDynamic
}
