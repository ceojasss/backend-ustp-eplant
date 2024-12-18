const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')
const OracleDB = require('oracledb')
const moment = require('moment-timezone');


const queryStatement = `
/* Formatted on 25/01/2016 12:16:45 (QP5 v5.115.810.9015) */
/* Formatted on 16/02/2023 16:01:34 (QP5 v5.115.810.9015) */
  SELECT   fg.description,
           fa.groupid,
           fa.fixedassetcode fixedassetcode_asli,
           fa.assetname assetname_asli,
           CASE
              WHEN CASE
                      WHEN parentfaassetcode = fa.fixedassetcode THEN NULL
                      WHEN get_faname (parentfaassetcode) IS NULL THEN NULL
                      ELSE parentfaassetcode
                   END IS NULL
              THEN
                 fa.fixedassetcode
              ELSE
                 '      ' || fa.fixedassetcode
           END
              fixedassetcode,
           CASE
              WHEN CASE
                      WHEN parentfaassetcode = fa.fixedassetcode THEN NULL
                      WHEN get_faname (parentfaassetcode) IS NULL THEN NULL
                      ELSE parentfaassetcode
                   END IS NULL
              THEN
                 fa.assetname
              ELSE
                 '      ' || fa.assetname
           END
              assetname,
           CASE
              WHEN parentfaassetcode = fa.fixedassetcode THEN NULL
              WHEN get_faname (parentfaassetcode) IS NULL THEN NULL
              ELSE parentfaassetcode
           END
              parentfacode,
           CASE
              WHEN parentfaassetcode <> fa.fixedassetcode
              THEN
                 get_faname (parentfaassetcode)
              ELSE
                 NULL
           END
              parentfaname,
           (  NVL (fa.acquisitionvalue, 0)
            + NVL (fa.additionvalue, 0)
            - NVL (fa.residualvalue, 0))
              costbase,
           NVL (cdpr.amount, 0) curr,
           NVL (ytddpr.amount, 0) ytd,
           NVL (ftddpr.amount, 0) accum,
           ROUND( (NVL (fa.acquisitionvalue, 0) + NVL (fa.additionvalue, 0))
                 - NVL (ftddpr.amount, 0))
              nett,
           vouc_num refference
    FROM   fafixedasset fa,
           fagroup fg,
           (  SELECT   f.fixedassetcode, SUM (ROUND (f.amount)) amount
                FROM   fatrxhistory f
               WHERE   ( (f.trxdate BETWEEN TO_DATE(:P_YEAR, 'YYYY')
                                        AND  TO_DATE(:P_PERIOD, 'MM')))
            GROUP BY   f.fixedassetcode) cdpr,
           (  SELECT   f.fixedassetcode, SUM (ROUND (f.amount)) amount
                FROM   fatrxhistory f
               --WHERE   ( (f.trxdate BETWEEN :V_STARTDATEPERIOD_ONE
                                        --AND  :V_ENDDATEPERIOD))
            GROUP BY   f.fixedassetcode) ytddpr,
           (  SELECT   f.fixedassetcode, SUM (f.amount) amount
                FROM   fatrxhistory f
               WHERE   ( (f.trxdate <= TO_DATE(:P_PERIOD, 'MM')))
            GROUP BY   f.fixedassetcode) ftddpr
   WHERE       ( (fa.groupid = fg.groupid))
           AND ( (fa.fixedassetcode = cdpr.fixedassetcode(+)))
           AND ( (fa.fixedassetcode = ytddpr.fixedassetcode(+)))
           AND ( (fa.fixedassetcode = ftddpr.fixedassetcode(+)))
           --AND fa.groupid = NVL (CAST (:V_GROUP AS CHAR (4)), fa.groupid)
           AND fa.fixedassetcode NOT IN
                    (SELECT   fixedassetcode
                       FROM   fafixedasset
                      WHERE   NVL (assetdate, startdepreciatedate) >
                                 TO_DATE(:P_PERIOD, 'MM')
                              AND groupid = 'A001')
           AND fa.groupid = NVL (:V_GROUP, fa.groupid)
           AND fa.startdepreciatedate <= TO_DATE(:P_PERIOD, 'MM')
           AND fa.fixedassetcode NOT IN
                    (SELECT   fixedassetcode
                       FROM   fadisposal
                      WHERE   effectivedate <= TO_DATE(:P_PERIOD, 'MM'))
           AND fa.assettype = 'Fixed Asset'
ORDER BY   fa.groupid,
           NVL (CASE
                   WHEN parentfaassetcode = fa.fixedassetcode THEN NULL
                   WHEN get_faname (parentfaassetcode) IS NULL THEN NULL
                   ELSE parentfaassetcode
                END, fa.fixedassetcode),
           NVL (CASE
                   WHEN parentfaassetcode = fa.fixedassetcode THEN NULL
                   WHEN get_faname (parentfaassetcode) IS NULL THEN NULL
                   ELSE parentfaassetcode
                END, '0'),
           startdepreciatedate
       
`

const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


  ///  let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
   //  let bindStatement = _.pick(find, ['P_YEAR', 'P_PERIOD', 'V_GROUP' ])


    let bindStatement = _.pick(find, ['P_YEAR','P_PERIOD','V_GROUP' ])


    console.log('bindStatement : ',bindStatement)


    try {
        result = await database.executeStmt(users, queryStatement, bindStatement)

        console.log('result :', result);

    } catch (errors) {

        error = errors

        console.log('errors : ', errors);
    }


    callback(error, result)
}


module.exports = {
    fetchDataDynamic
}