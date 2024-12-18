const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const firstQuery = `
SELECT :p_year                       fiscalyear,
         :p_month                       period,
         ktcode,
         x.fieldcode,
         jobcode,
         getjob_des (jobcode)     description,
         sourcetype,
         sourcename,
         sourcecode,
         qty,
         hk,
         amt,
         remarks
    FROM (  SELECT TARGETCODE         fieldcode,
                   JOBcode,
                   --getjob_des (jobcode) description,
                   sourcetype,
                   sourcetype         sourcecode,
                   NULL               sourcename,
                   SUM (quantity)     qty,
                   SUM (mandays)      hk,
                   SUM (TVALUE)       amt,
                   'Rawat Actual'     remarks
              FROM costbook c, fieldcrop f, periodctlmst p
             WHERE     targettype = 'OP'
                   AND targetcode = f.fieldcode
                   AND intiplasma = 0
                   AND :p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >= 4
                   AND jobcode LIKE 'P%'
                   AND jobcode NOT LIKE 'P04%'
                   AND jobcode NOT LIKE 'P05%'
                   AND jobcode NOT LIKE 'P092%'
                   AND tdate BETWEEN startdate AND enddate
                   AND periodseq = :p_month
                   AND accyear = :p_year
          GROUP BY TARGETCODE,
                   JOBcode,
                   sourcetype,
                   sourcetype
          UNION ALL
            SELECT TARGETCODE
                       fieldcode,
                   JOBcode,
                   -- getjob_des (jobcode) description,
                   sourcetype,
                   CASE
                       WHEN sourcecode LIKE 'AB%' THEN sourcecode
                       ELSE sourcetype
                   END,
                   CASE
                       WHEN sourcetype = 'ST'
                       THEN
                           get_purchaseitemname (
                               CASE
                                   WHEN sourcecode LIKE 'AB%' THEN sourcecode
                                   ELSE sourcetype
                               END)
                       ELSE
                           NULL
                   END,
                   SUM (
                       CASE
                           WHEN     referenceno LIKE '%RTN%'
                                AND sourcecode LIKE 'AB%'
                           THEN
                               quantity * -1
                           WHEN     referenceno NOT LIKE '%RTN%'
                                AND sourcecode LIKE 'AB%'
                           THEN
                               quantity
                           ELSE
                               0
                       END)
                       qty,
                   SUM (mandays)
                       hk,
                   SUM (TVALUE)
                       amt,
                   'Pupuk Actual'
              FROM costbook c, fieldcrop f, periodctlmst p
             WHERE     targettype = 'OP'
                   AND targetcode = f.fieldcode
                   AND intiplasma = 0
                   AND :p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >= 4
                   AND jobcode LIKE 'P04%'
                   AND sourcecode LIKE 'AB%'
                   AND sourcetype = 'ST'
                   AND tdate BETWEEN startdate AND enddate
                   AND periodseq = :p_month
                   AND accyear = :p_year
          GROUP BY TARGETCODE,
                   JOBcode,
                   CASE
                       WHEN sourcecode LIKE 'AB%' THEN sourcecode
                       ELSE sourcetype
                   END,
                   sourcetype,
                   sourcetype
          UNION ALL
            SELECT TARGETCODE         fieldcode,
                   JOBcode,
                   --getjob_des (jobcode) description,
                   sourcetype,
                   sourcetype         sourcecode,
                   NULL               sourcename,
                   SUM (quantity)     qty,
                   SUM (mandays)      hk,
                   SUM (TVALUE)       amt,
                   'Panen Actual'     remarks
              FROM costbook c, fieldcrop f, periodctlmst p
             WHERE     targettype = 'OP'
                   AND targetcode = f.fieldcode
                   AND intiplasma = 0
                   AND jobcode LIKE 'P05%'
                   AND tdate BETWEEN startdate AND enddate
                   AND periodseq = :p_month
                   AND accyear = :p_year
          GROUP BY TARGETCODE,
                   JOBcode,
                   sourcetype,
                   sourcetype
          UNION ALL
            SELECT TARGETCODE
                       fieldcode,
                   JOBcode,
                   --getjob_des (jobcode) description,
                   sourcetype,
                   CASE
                       WHEN sourcecode LIKE 'AB%' THEN sourcecode
                       ELSE sourcetype
                   END,
                   CASE
                       WHEN sourcetype = 'ST'
                       THEN
                           get_purchaseitemname (
                               CASE
                                   WHEN sourcecode LIKE 'AB%' THEN sourcecode
                                   ELSE sourcetype
                               END)
                       ELSE
                           NULL
                   END,
                     SUM (
                         CASE WHEN sourcecode LIKE 'AB%' THEN quantity ELSE 0 END)
                   / 12
                       qty,
                   SUM (mandays) / 12
                       hk,
                   (SUM (debitamount) + SUM (creditamount)) / 12 * 1000
                       amt,
                   'Pupuk Budget'
              FROM budgettbactivity c, budgetfieldcrop f
             WHERE     targettype = 'OP'
                   AND targetcode = f.fieldcode
                   AND intiplasma = 0
                   AND c.budgetyear = :p_year
                   AND f.budgetyear = :p_year
                   AND :p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >= 4
                   AND jobcode LIKE 'P04%'
                   AND jobcode NOT LIKE 'P092%'
          GROUP BY TARGETCODE,
                   JOBcode,
                   CASE
                       WHEN sourcecode LIKE 'AB%' THEN sourcecode
                       ELSE sourcetype
                   END,
                   sourcetype,
                   sourcetype
          UNION ALL
            SELECT TARGETCODE
                       fieldcode,
                   JOBcode,
                   --getjob_des (jobcode) description,
                   sourcetype,
                   CASE
                       WHEN sourcecode LIKE 'AB%' THEN sourcecode
                       ELSE sourcetype
                   END,
                   CASE
                       WHEN sourcetype = 'ST'
                       THEN
                           get_purchaseitemname (
                               CASE
                                   WHEN sourcecode LIKE 'AB%' THEN sourcecode
                                   ELSE sourcetype
                               END)
                       ELSE
                           NULL
                   END,
                   SUM (
                       CASE
                           WHEN     referenceno LIKE '%RTN%'
                                AND sourcecode LIKE 'AB%'
                           THEN
                               quantity * -1
                           WHEN     referenceno NOT LIKE '%RTN%'
                                AND sourcecode LIKE 'AB%'
                           THEN
                               quantity
                           ELSE
                               0
                       END)
                       qty,
                   SUM (mandays)
                       hk,
                     SUM (TVALUE)
                   * CASE
                         WHEN :p_year || LPAD ( :p_month, 2, '0') <= '202203' THEN 0.1
                         ELSE 0.11
                     END
                       amt,
                   'PPN Pupuk Actual'
              FROM costbook c, fieldcrop f, periodctlmst p
             WHERE     targettype = 'OP'
                   AND targetcode = f.fieldcode
                   AND intiplasma = 0
                   AND :p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >= 4
                   AND jobcode LIKE 'P04%'
                   AND sourcecode LIKE 'AB%'
                   AND sourcetype = 'ST'
                   AND tdate BETWEEN startdate AND enddate
                   AND periodseq = :p_month
                   AND accyear = :p_year
          GROUP BY TARGETCODE,
                   JOBcode,
                   CASE
                       WHEN sourcecode LIKE 'AB%' THEN sourcecode
                       ELSE sourcetype
                   END,
                   sourcetype,
                   sourcetype) x,
         blockkelompoktani b
   WHERE x.fieldcode = b.fieldcode
--AND ktcode = NVL(:P_KTCODE, ktcode)
ORDER BY 1,
         2,
         3,
         4,
         5,
         7`


const secondQuery = `/* Formatted on 15/03/2023 13:47:09 (QP5 v5.115.810.9015) */
SELECT   ktcode,
         sourcecode,
         sourcename,
         qty,
         hk,
         amt,
         remarks
  FROM   (  SELECT   ktcode,
                     NULL sourcecode,
                     NULL sourcename,
                     0 qty,
                     SUM (mandays) hk,
                     SUM (TVALUE) amt,
                     'Rawat Actual' remarks
              FROM   costbook c,
                     fieldcrop f,
                     blockkelompoktani k,
                     periodctlmst p
             WHERE       targettype = 'OP'
                     AND targetcode = f.fieldcode
                     AND f.fieldcode = k.fieldcode
                     AND intiplasma = 0
                     AND periodseq = :p_month
                     AND accyear = :p_year
                     AND:p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >=
                           4
                     AND jobcode LIKE 'P%'
                     AND jobcode NOT LIKE 'P04%'
                     AND jobcode NOT LIKE 'P05%'
                     AND jobcode NOT LIKE 'P092%'
                     AND tdate BETWEEN startdate AND enddate
          GROUP BY   ktcode
          UNION ALL
            SELECT   ktcode,
                     CASE
                        WHEN sourcecode LIKE 'AB%' THEN sourcecode
                        ELSE sourcetype
                     END,
                     get_purchaseitemname(CASE
                                             WHEN sourcecode LIKE 'AB%'
                                             THEN
                                                sourcecode
                                             ELSE
                                                sourcetype
                                          END),
                     SUM(CASE
                            WHEN referenceno LIKE '%RTN%'
                                 AND sourcecode LIKE 'AB%'
                            THEN
                               quantity * -1
                            WHEN referenceno NOT LIKE '%RTN%'
                                 AND sourcecode LIKE 'AB%'
                            THEN
                               quantity
                            ELSE
                               0
                         END)
                        qty,
                     SUM (mandays) hk,
                     SUM (TVALUE) amt,
                     'Pupuk Actual'
              FROM   costbook c,
                     fieldcrop f,
                     blockkelompoktani k,
                     periodctlmst p
             WHERE       targettype = 'OP'
                     AND targetcode = f.fieldcode
                     AND f.fieldcode = k.fieldcode
                     AND intiplasma = 0
                     AND periodseq = :p_month
                     AND accyear = :p_year
                     AND:p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >=
                           4
                     AND jobcode LIKE 'P04%'
                     AND sourcecode LIKE 'AB%'
                     AND sourcetype = 'ST'
                     AND tdate BETWEEN startdate AND enddate
          GROUP BY   ktcode,
                     CASE
                        WHEN sourcecode LIKE 'AB%' THEN sourcecode
                        ELSE sourcetype
                     END
          UNION ALL
            SELECT   ktcode,
                     NULL sourcecode,
                     NULL sourcename,
                     0 qty,
                     SUM (mandays) hk,
                     SUM (TVALUE) amt,
                     'Panen Actual' remarks
              FROM   costbook c,
                     fieldcrop f,
                     blockkelompoktani k,
                     periodctlmst p
             WHERE       targettype = 'OP'
                     AND targetcode = f.fieldcode
                     AND f.fieldcode = k.fieldcode
                     AND intiplasma = 0
                     AND periodseq = :p_month
                     AND accyear = :p_year
                     AND jobcode LIKE 'P05%'
                     AND tdate BETWEEN startdate AND enddate
          GROUP BY   ktcode
          UNION ALL
            SELECT   ktcode,
                     CASE
                        WHEN sourcecode LIKE 'AB%' THEN sourcecode
                        ELSE NULL
                     END,
                     get_purchaseitemname(CASE
                                             WHEN sourcecode LIKE 'AB%'
                                             THEN
                                                sourcecode
                                             ELSE
                                                NULL
                                          END),
                     SUM(CASE
                            WHEN sourcecode LIKE 'AB%' THEN quantity
                            ELSE 0
                         END)
                     / 12
                        qty,
                     SUM (mandays) / 12 hk,
                     (SUM (debitamount) + SUM (creditamount)) / 12 * 1000 amt,
                     'Pupuk Budget'
              FROM   budgettbactivity c, budgetfieldcrop f, blockkelompoktani k
             WHERE       targettype = 'OP'
                     AND targetcode = f.fieldcode
                     AND f.fieldcode = k.fieldcode
                     AND intiplasma = 0
                     AND c.budgetyear = :p_year
                     AND f.budgetyear = :p_year
                     AND:p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >=
                           4
                     AND jobcode LIKE 'P04%'
                     AND jobcode NOT LIKE 'P092%'
          GROUP BY   ktcode,
                     CASE
                        WHEN sourcecode LIKE 'AB%' THEN sourcecode
                        ELSE NULL
                     END
          UNION ALL
            SELECT   ktcode,
                     CASE
                        WHEN sourcecode LIKE 'AB%' THEN sourcecode
                        ELSE sourcetype
                     END,
                     get_purchaseitemname(CASE
                                             WHEN sourcecode LIKE 'AB%'
                                             THEN
                                                sourcecode
                                             ELSE
                                                sourcetype
                                          END),
                     SUM(CASE
                            WHEN referenceno LIKE '%RTN%'
                                 AND sourcecode LIKE 'AB%'
                            THEN
                               quantity * -1
                            WHEN referenceno NOT LIKE '%RTN%'
                                 AND sourcecode LIKE 'AB%'
                            THEN
                               quantity
                            ELSE
                               0
                         END)
                        qty,
                     SUM (mandays) hk,
                     SUM (TVALUE)
                     * CASE
                          WHEN :p_year || LPAD (:p_month, 2, '0') <= '202203'
                          THEN
                             0.1
                          ELSE
                             0.11
                       END
                        amt,
                     'PPN Pupuk Actual'
              FROM   costbook c,
                     fieldcrop f,
                     blockkelompoktani k,
                     periodctlmst p
             WHERE       targettype = 'OP'
                     AND targetcode = f.fieldcode
                     AND f.fieldcode = k.fieldcode
                     AND intiplasma = 0
                     AND periodseq = :p_month
                     AND accyear = :p_year
                     AND:p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >=
                           4
                     AND jobcode LIKE 'P04%'
                     AND sourcecode LIKE 'AB%'
                     AND sourcetype = 'ST'
                     AND tdate BETWEEN startdate AND enddate
          GROUP BY   ktcode,
                     CASE
                        WHEN sourcecode LIKE 'AB%' THEN sourcecode
                        ELSE sourcetype
                     END)
ORDER BY   1, 7, 2`


const thirdQuery = `/* Formatted on 06/06/2022 16:40:52 (QP5 v5.115.810.9015) */
SELECT                                                               --ktcode,
      SUM (TVALUE) amt, 'Rawat Actual' remarks
  FROM   costbook c, fieldcrop f, periodctlmst p, blockkelompoktani b
 WHERE       targettype = 'OP'
         AND targetcode = f.fieldcode
         AND intiplasma = 0
           AND periodseq = :p_month
           AND accyear = :p_year 
         AND:p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >= 4
         AND jobcode LIKE 'P%'
         AND jobcode NOT LIKE 'P04%'
         AND jobcode NOT LIKE 'P05%'
         AND jobcode NOT LIKE 'P092%'
         AND tdate BETWEEN startdate and enddate
         and f.fieldcode = b.fieldcode
         --and ktcode = NVL(:p_ktcode,ktcode)
--GROUP BY   ktcode
UNION ALL
SELECT                                                               --ktcode,
      SUM (TVALUE) amt, 'Panen Actual' remarks
  FROM   costbook c, fieldcrop f, periodctlmst p, blockkelompoktani b
 WHERE       targettype = 'OP'
         AND targetcode = f.fieldcode
         AND intiplasma = 0
         AND jobcode LIKE 'P05%'
           AND periodseq = :p_month
           AND accyear = :p_year 
         AND tdate BETWEEN startdate and enddate
         and f.fieldcode = b.fieldcode
         --and ktcode = NVL(:p_ktcode,ktcode)
--GROUP BY   ktcode
UNION ALL
SELECT                                                               --ktcode,
       ( SUM (debitamount) + SUM (creditamount)) / 12 * 1000 amt,
         'Pupuk Budget'
  FROM   budgettbactivity c, budgetfieldcrop f, blockkelompoktani b
 WHERE       targettype = 'OP'
         AND targetcode = f.fieldcode
         AND intiplasma = 0
         AND c.budgetyear = :p_year
         AND f.budgetyear = :p_year
         AND:p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >= 4
         AND jobcode LIKE 'P04%'
         AND jobcode NOT LIKE 'P092%'
         and f.fieldcode = b.fieldcode
         --and ktcode = NVL(:p_ktcode,ktcode)
/*GROUP BY   ktcode,
           CASE
              WHEN sourcecode LIKE 'AB%' THEN sourcecode
              ELSE NULL
           END*/
UNION ALL
SELECT                                                               --ktcode,
      SUM (TVALUE)
         * CASE
              WHEN :p_year || LPAD (:p_month, 2, '0') <= '202203' THEN 0.1
              ELSE 0.11
           END
            amt,
         'PPN Pupuk Actual'
  FROM   costbook c, fieldcrop f, periodctlmst p, blockkelompoktani b
 WHERE       targettype = 'OP'
         AND targetcode = f.fieldcode
         AND intiplasma = 0
           AND periodseq = :p_month
           AND accyear = :p_year 
         AND:p_year - NVL (TO_CHAR (plantingdate, 'yyyy'), :p_year) >= 4
         AND jobcode LIKE 'P04%'
         AND sourcecode LIKE 'AB%'
         AND sourcetype = 'ST'
         AND tdate BETWEEN startdate and enddate
         and f.fieldcode = b.fieldcode
         --and ktcode = NVL(:p_ktcode,ktcode)
/*GROUP BY   ktcode,
           CASE
              WHEN sourcecode LIKE 'AB%' THEN sourcecode
              ELSE sourcetype
           END*/
ORDER BY   2`




const fetchDataDynamic = async function (users, find, callback) {
    let result, error, secondresult,thirdresult,fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :p_month, :p_year, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :p_month, :p_year, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    


  ///  let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['p_year','p_month'])


    try {
        result = await database.executeStmt(users, firstQuery, bindStatement)
        secondresult = await database.executeStmt(users, secondQuery, bindStatement)
        thirdresult = await database.executeStmt(users, thirdQuery, bindStatement)



    } catch (errors) {

        error = errors
    }


    callback(error, result, secondresult, thirdresult)
}


module.exports = {
    fetchDataDynamic
}