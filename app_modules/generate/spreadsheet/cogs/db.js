const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `SELECT   CASE WHEN jobcode LIKE '4120110%' THEN 'CPO' ELSE 'PK' END product,
ABS (ROUND (SUM (tvalue))) sales_amount,
ROUND (SUM (tvalue) / SUM (SUM (tvalue)) OVER (PARTITION BY NULL) * 100) pct
FROM   costbook
WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
          AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
AND jobcode IN ('41201101', '41201102', '41301101', '41301102')
GROUP BY   CASE WHEN jobcode LIKE '4120110%' THEN 'CPO' ELSE 'PK' END
ORDER BY   1`

const queryStatement2 = `SELECT   jobcode,
jobdesc,
amount,
CASE
   WHEN jobcode LIKE '514051%' THEN 100
   WHEN jobcode LIKE '515051%' THEN 0
   ELSE cpo
END
   cpo,
CASE
   WHEN jobcode LIKE '514051%' THEN amount
   WHEN jobcode LIKE '515051%' THEN 0
   ELSE amount * cpo / 100
END
   allocatedtocpo,
CASE
   WHEN jobcode LIKE '514051%' THEN 0
   WHEN jobcode LIKE '515051%' THEN 100
   ELSE pk
END
   pk,
CASE
   WHEN jobcode LIKE '514051%' THEN 0
   WHEN jobcode LIKE '515051%' THEN amount
   ELSE amount * pk / 100
END
   allocatedtopk
FROM   (  SELECT   jobcode, getjob_des (jobcode) jobdesc, SUM (tvalue) amount
     FROM   costbook
    WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                      AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
            AND jobcode IN ('51101100', '51101200', '51101300', '51101400', '51101500', '51101600')
 GROUP BY   jobcode
 UNION ALL
   SELECT   jobcode, getjob_des (jobcode), SUM (tvalue)
     FROM   costbook
    WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                      AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
            AND jobcode IN ('51200000', '51201000','51300000','51301000')
           AND referenceno not like '%PLASMA%'
 GROUP BY   jobcode
 UNION ALL
   SELECT   jobcode, getjob_des (jobcode), SUM (tvalue)
     FROM   costbook
    WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                      AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
            AND jobcode IN
                     ('51402000',
                      '51403000',
                      '51404000',
                      '51405000',
                      '51405100',
                      '51405101',
                      '51405102',
                      '51405103',
                      '51405104',
                      '51405105')
 GROUP BY   jobcode
 UNION ALL
   SELECT   jobcode, getjob_des (jobcode), SUM (tvalue)
     FROM   costbook
    WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                      AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
            AND jobcode IN
                     ('51502000',
                      '51503000',
                      '51504000',
                      '51505000',
                      '51505100',
                      '51505101',
                      '51505102',
                      '51505103',
                      '51505104',
                      '51505105')
 GROUP BY   jobcode) x,
(SELECT   SUM (DECODE (product, 'CPO', pct, 0)) cpo, SUM (DECODE (product, 'PK', pct, 0)) pk
   FROM   (  SELECT   CASE WHEN jobcode LIKE '4120110%' THEN 'CPO' ELSE 'PK' END product,
                      ABS (ROUND (SUM (tvalue))) sales_amount,
                      ROUND (SUM (tvalue) / SUM (SUM (tvalue)) OVER (PARTITION BY NULL) * 100) pct
               FROM   costbook
              WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                                AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
                      AND jobcode IN ('41201101', '41201102', '41301101', '41301102')
           GROUP BY   CASE WHEN jobcode LIKE '4120110%' THEN 'CPO' ELSE 'PK' END)) y
ORDER BY   1
`
const queryStatement3 = `SELECT   SUM (amount * cpo / 100) cpoproductionamount,
get_product ('CPO',
             'PS',
             :P_MONTH,
             :P_YEAR)
   cpoproductionkg,
SUM (amount * cpo / 100)
/ get_product ('CPO',
               'PS',
               :P_MONTH,
               :P_YEAR)
   costperkgcpo,
SUM (amount * pk / 100) pkproductionamount,
get_product ('PK',
             'PS',
             :P_MONTH,
             :P_YEAR)
   pkproductionkg,
SUM (amount * pk / 100)
/ get_product ('PK',
               'PS',
               :P_MONTH,
               :P_YEAR)
   costperkgpk
FROM   (  SELECT   jobcode, getjob_des (jobcode) jobdesc, SUM (tvalue) amount
     FROM   costbook
    WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                      AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
            AND jobcode IN ('51101100', '51101200', '51101300', '51101400', '51101500', '51101600')
 GROUP BY   jobcode
 UNION ALL
   SELECT   jobcode, getjob_des (jobcode), SUM (tvalue)
     FROM   costbook
    WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                      AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
            AND jobcode IN ('51200000', '51201000','51300000', '51301000')
            AND referenceno NOT LIKE '%PLASMA%'
 GROUP BY   jobcode
 UNION ALL
   SELECT   jobcode, getjob_des (jobcode), SUM (tvalue)
     FROM   costbook
    WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                      AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
            AND jobcode IN
                     ('51402000',
                      '51403000',
                      '51404000',
                      '51405000'
                      )
 GROUP BY   jobcode
 UNION ALL
   SELECT   jobcode, getjob_des (jobcode), SUM (tvalue)
     FROM   costbook
    WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                      AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
            AND jobcode IN
                     ('51502000',
                      '51503000',
                      '51504000',
                      '51505000'
                      )
 GROUP BY   jobcode) x,
(SELECT   SUM (DECODE (product, 'CPO', pct, 0)) cpo, SUM (DECODE (product, 'PK', pct, 0)) pk
   FROM   (  SELECT   CASE WHEN jobcode LIKE '4120110%' THEN 'CPO' ELSE 'PK' END product,
                      ABS (ROUND (SUM (tvalue))) sales_amount,
                      ROUND (SUM (tvalue) / SUM (SUM (tvalue)) OVER (PARTITION BY NULL) * 100) pct
               FROM   costbook
              WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                                AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
                      AND jobcode IN ('41201101', '41201102', '41301101', '41301102')
           GROUP BY   CASE WHEN jobcode LIKE '4120110%' THEN 'CPO' ELSE 'PK' END)) y
ORDER BY   1
`

const queryStatement4 = `SELECT   productcode,
ket,
qty,
amt,
DECODE (qty, 0, 0, amt / qty) avgprice2
FROM   (  SELECT   productcode,
            ket,
            SUM (qty) qty,
            DECODE (ket,
                    '1.OPENING',
                    get_product_amt ('CPO',
                                     'O',
                                     :P_MONTH,
                                     :P_YEAR),
                    '2.PRODUCTION',
                    get_product_amt ('CPO',
                                     'P',
                                     :P_MONTH,
                                     :P_YEAR),
                    '3.BUY',
                    get_product_amt ('CPO',
                                     'B',
                                     :P_MONTH,
                                     :P_YEAR),
                    '4.TOTAL',
                    get_product_amt ('CPO',
                                     'T',
                                     :P_MONTH,
                                     :P_YEAR),
                    '5.DISPATCH',
                    (get_product_amt ('CPO',
                                      'T',
                                      :P_MONTH,
                                      :P_YEAR)
                     / get_product ('CPO',
                                    'T',
                                    :P_MONTH,
                                    :P_YEAR))
                    * get_product ('CPO',
                                   'D',
                                   :P_MONTH,
                                   :P_YEAR),
                    '6.ENDING',
                    (get_product_amt ('CPO',
                                      'T',
                                      :P_MONTH,
                                      :P_YEAR)
                     / get_product ('CPO',
                                    'T',
                                    :P_MONTH,
                                    :P_YEAR))
                    * get_product ('CPO',
                                   'E',
                                   :P_MONTH,
                                   :P_YEAR))
               amt /*,
             DECODE (ket,
                     '1.OPENING',
                     get_product_amt ('CPO',
                                      'O',
                                      :P_MONTH,
                                      :P_YEAR),
                     '2.PRODUCTION',
                     get_product_amt ('CPO',
                                      'P',
                                      :P_MONTH,
                                      :P_YEAR),
                     '3.TOTAL',
                     get_product_amt ('CPO',
                                      'T',
                                      :P_MONTH,
                                      :P_YEAR),
                    '4.DISPATCH',
                     get_product_amt ('CPO',
                                      'T',
                                      :P_MONTH,
                                      :P_YEAR),
'5.ENDING',
                     get_product_amt ('CPO',
                                      'T',
                                      :P_MONTH,
                                      :P_YEAR))
             / SUM (qty)
                avgprice*/
     FROM   (  SELECT   productcode, '1.OPENING' ket, SUM (opening) * 1000 qty
                 FROM   productstoragedetail_consol
                WHERE       tdate = TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                        AND productcode IN ('CPO')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode
             UNION ALL
               SELECT   productcode, '6.ENDING' ket, SUM (ending) * 1000
                 FROM   productstoragedetail_consol
                WHERE       tdate = LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
                        AND productcode IN ('CPO')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode
             UNION ALL
               SELECT   productcode,
                        '2.PRODUCTION' ket,
                        (SUM (production) * 1000)
                        + (SUM (NVL (CASE WHEN transfer > 0 THEN transfer ELSE 0 END, 0)) * 1000)
                           production
                 FROM   productstoragedetail_consol
                WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                                  AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
                        AND productcode IN ('CPO')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode
             UNION ALL
               SELECT   'CPO' productcode,
                        '3.BUY' ket,
                        get_oil_beli_bymonth (:P_MONTH, :P_YEAR) buy
                 FROM   dual                           
             UNION ALL
               SELECT   productcode, '4.TOTAL' ket, SUM (opening) * 1000 qty
                 FROM   productstoragedetail_consol
                WHERE       tdate = TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                        AND productcode IN ('CPO')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode
             UNION ALL
               SELECT   productcode,
                        '4.TOTAL' ket,
                        (SUM (production) * 1000)
                        + (SUM (NVL (CASE WHEN transfer > 0 THEN transfer ELSE 0 END, 0)) * 1000)
                           production
                 FROM   productstoragedetail_consol
                WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                                  AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
                        AND productcode IN ('CPO')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode
             UNION ALL
               SELECT   'CPO' productcode,
                        '4.TOTAL' ket,
                        get_oil_beli_bymonth (:P_MONTH, :P_YEAR) buy
                 FROM   dual                           
             UNION ALL
               SELECT   productcode,
                        '5.DISPATCH' ket,
                        (SUM (dispatch - retur) * 1000)
                        + (SUM (NVL (CASE WHEN transfer < 0 THEN transfer * -1 ELSE 0 END, 0)) * 1000)
                           dispatch
                 FROM   productstoragedetail_consol
                WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                                  AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
                        AND productcode IN ('CPO')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode)
 GROUP BY   productcode, ket)
UNION ALL
SELECT   'CPO',
'7.ADJ',
0,
get_product_amt ('CPO',
                 'O',
                 :P_MONTH,
                 :P_YEAR)
- (get_product_amt ('CPO',
                    'T',
                    :P_MONTH,
                    :P_YEAR)
   / get_product ('CPO',
                  'T',
                  :P_MONTH,
                  :P_YEAR))
  * get_product ('CPO',
                 'E',
                 :P_MONTH,
                 :P_YEAR),
0
FROM   DUAL
ORDER BY   1, 2 
`

const queryStatement5 = `SELECT   productcode,
ket,
qty,
amt,
DECODE (qty, 0, 0, amt / qty) avgprice2
FROM   (  SELECT   productcode,
            ket,
            SUM (qty) qty,
            DECODE (ket,
                    '1.OPENING',
                    get_product_amt ('PK',
                                     'O',
                                     :P_MONTH,
                                     :P_YEAR),
                    '2.PRODUCTION',
                    get_product_amt ('PK',
                                     'P',
                                     :P_MONTH,
                                     :P_YEAR),
                    '3.BUY',
                    get_product_amt ('PK',
                                     'B',
                                     :P_MONTH,
                                     :P_YEAR),
                    '4.TOTAL',
                    get_product_amt ('PK',
                                     'T',
                                     :P_MONTH,
                                     :P_YEAR),
                    '5.DISPATCH',
                    (get_product_amt ('PK',
                                      'T',
                                      :P_MONTH,
                                      :P_YEAR)
                     / get_product ('PK',
                                    'T',
                                    :P_MONTH,
                                    :P_YEAR))
                    * get_product ('PK',
                                   'D',
                                   :P_MONTH,
                                   :P_YEAR),
                    '6.ENDING',
                    (get_product_amt ('PK',
                                      'T',
                                      :P_MONTH,
                                      :P_YEAR)
                     / get_product ('PK',
                                    'T',
                                    :P_MONTH,
                                    :P_YEAR))
                    * get_product ('PK',
                                   'E',
                                   :P_MONTH,
                                   :P_YEAR))
               amt /*,
             DECODE (ket,
                     '1.OPENING',
                     get_product_amt ('PK',
                                      'O',
                                      :P_MONTH,
                                      :P_YEAR),
                     '2.PRODUCTION',
                     get_product_amt ('PK',
                                      'P',
                                      :P_MONTH,
                                      :P_YEAR),
                     '3.TOTAL',
                     get_product_amt ('PK',
                                      'T',
                                      :P_MONTH,
                                      :P_YEAR),
                    '4.DISPATCH',
                     get_product_amt ('PK',
                                      'T',
                                      :P_MONTH,
                                      :P_YEAR),
'5.ENDING',
                     get_product_amt ('PK',
                                      'T',
                                      :P_MONTH,
                                      :P_YEAR))
             / SUM (qty)
                avgprice*/
     FROM   (  SELECT   productcode, '1.OPENING' ket, SUM (opening) * 1000 qty
                 FROM   productstoragedetail_consol
                WHERE       tdate = TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                        AND productcode IN ('PK')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode
             UNION ALL
               SELECT   productcode, '6.ENDING' ket, SUM (ending) * 1000
                 FROM   productstoragedetail_consol
                WHERE       tdate = LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
                        AND productcode IN ('PK')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode
             UNION ALL
               SELECT   productcode,
                        '2.PRODUCTION' ket,
                        (SUM (production) * 1000)
                        + (SUM (NVL (CASE WHEN transfer > 0 THEN transfer ELSE 0 END, 0)) * 1000)
                           production
                 FROM   productstoragedetail_consol
                WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                                  AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
                        AND productcode IN ('PK')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode
             UNION ALL
               SELECT   'PK' productcode,
                        '3.BUY' ket,
                        get_pk_beli_bymonth (:P_MONTH, :P_YEAR) buy
                 FROM   dual                           
             UNION ALL
               SELECT   productcode, '4.TOTAL' ket, SUM (opening) * 1000 qty
                 FROM   productstoragedetail_consol
                WHERE       tdate = TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                        AND productcode IN ('PK')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode
             UNION ALL
               SELECT   productcode,
                        '4.TOTAL' ket,
                        (SUM (production) * 1000)
                        + (SUM (NVL (CASE WHEN transfer > 0 THEN transfer ELSE 0 END, 0)) * 1000)
                           production
                 FROM   productstoragedetail_consol
                WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                                  AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
                        AND productcode IN ('PK')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode
             UNION ALL
               SELECT   'PK' productcode,
                        '4.TOTAL' ket,
                        get_pk_beli_bymonth (:P_MONTH, :P_YEAR) buy
                 FROM   dual                           
             UNION ALL
               SELECT   productcode,
                        '5.DISPATCH' ket,
                        (SUM (dispatch - retur) * 1000)
                        + (SUM (NVL (CASE WHEN transfer < 0 THEN transfer * -1 ELSE 0 END, 0)) * 1000)
                           dispatch
                 FROM   productstoragedetail_consol
                WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
                                  AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
                        AND productcode IN ('PK')
                        AND site = (SELECT parametername
                                      FROM   parameter
                                     WHERE parametercode = 'COMP_CODE')
             GROUP BY   productcode)
 GROUP BY   productcode, ket)
UNION ALL
SELECT   'PK',
'7.ADJ',
0,
get_product_amt ('PK',
                 'O',
                 :P_MONTH,
                 :P_YEAR)
- (get_product_amt ('PK',
                    'T',
                    :P_MONTH,
                    :P_YEAR)
   / get_product ('PK',
                  'T',
                  :P_MONTH,
                  :P_YEAR))
  * get_product ('PK',
                 'E',
                 :P_MONTH,
                 :P_YEAR),
0
FROM   DUAL
ORDER BY   1, 2
`

const queryStatement6 = `SELECT   jobcode,
getjob_des (jobcode) jobdes,
referenceno,
DECODE (SIGN (tvalue), 1, tvalue, 0) debet,
DECODE (SIGN (tvalue), -1, tvalue, 0) credit, remarks
FROM   costbook
WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy')
          AND  LAST_DAY (TO_DATE ('01' || LPAD (:P_MONTH, 2, 0) || :P_YEAR, 'ddmmyyyy'))
--AND ((referenceno LIKE 'CA-FG-CPO%' OR referenceno LIKE 'CA-FG-PK%') OR jobcode IN ('51491000','51591000','11501001','11501002'))
AND (jobcode IN ('51491000','51591000','11501001','11501002'))
ORDER BY   referenceno ASC, tvalue DESC`



const fetchDataDynamic = async function (users, find, callback) {
    let result, result2, result3, result4, result5, result6, error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


    // let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['P_MONTH', 'P_YEAR'])

    try {
        result = await database.executeStmt(users, queryStatement, bindStatement)
        result2 = await database.executeStmt(users, queryStatement2, bindStatement)
        result3 = await database.executeStmt(users, queryStatement3, bindStatement)
        result4 = await database.executeStmt(users, queryStatement4, bindStatement)
        result5 = await database.executeStmt(users, queryStatement5, bindStatement)
        result6 = await database.executeStmt(users, queryStatement6, bindStatement)

    } catch (errors) {

        error = errors
    }


    callback(error, result,result2,result3,result4,result5,result6)
}


module.exports = {
    fetchDataDynamic
}
