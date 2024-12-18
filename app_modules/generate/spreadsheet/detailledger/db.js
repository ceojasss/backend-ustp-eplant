const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `  SELECT tdate "tdate",
JOBDESCRIPTION                    "jobdescription",
openingbalance                    "openingbalance",
SUM (ABS (debit)) OVER ()         "cs_total_debit",
SUM (ABS (credit)) OVER ()        "cs_total_credit",
ABS (credit)                      "credit",
NO                                "no",
JOBCODE                           "jobcode",
REFERENCENO                       "referenceno",
TARGETTYPE                        "targettype",
TARGETCODE                        "targetcode",
SOURCECODE                        "sourcecode",
SOURCETYPE                        "sourcetype",
DESCRIPTION                       "description",
DEBIT                             "debit",
BALANCE                           "balance",
ROWNUM                            "cs urutan",
  SUM (NVL (debit, 0) + NVL (credit, 0))
          OVER (PARTITION BY jobcode
                ORDER BY
                        JOBCODE,
                        NO,
                        TDATE,
                        REFERENCENO,
                        SOURCETYPE,
                        SOURCECODE,
                        TARGETTYPE,
                        TARGETCODE,
                        ROWNUM)
+ NVL (openingbalance, 0)         "endbalance"
FROM RPT_DETAIL_LEDGER
WHERE     NO <> 1
AND SOURCETYPE = NVL ( :P_SOURCETYPE, SOURCETYPE)
AND SOURCECODE LIKE NVL ( :P_SOURCECODE, SOURCECODE) || '%'
AND TARGETTYPE = NVL ( :P_TARGETTYPE, TARGETTYPE)
AND TARGETCODE LIKE NVL ( :P_TARGETCODE, TARGETCODE) || '%'
ORDER BY JOBCODE,
NO,
TDATE,
REFERENCENO,
SOURCETYPE,
SOURCECODE,
TARGETTYPE,
TARGETCODE`




const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // custom code
    if (find.report === 'M') {
        fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    } else {
        fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
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
