const Test = `SELECT :1                       fiscalyear,
:2                       period,
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
     FROM costbook c, fieldcrop f
    WHERE     targettype = 'OP'
          AND targetcode = f.fieldcode
          AND intiplasma = 0
          AND :1 - NVL (TO_CHAR (plantingdate, 'yyyy'), :1) >= 4
          AND jobcode LIKE 'P%'
          AND jobcode NOT LIKE 'P04%'
          AND jobcode NOT LIKE 'P05%'
          AND jobcode NOT LIKE 'P092%'
          AND tdate BETWEEN TO_DATE ('01' || LPAD ( :2, 2, 0) || :1,
                                     'ddmmyyyy')
                        AND LAST_DAY (
                                TO_DATE ('01' || LPAD ( :2, 2, 0) || :1,
                                         'ddmmyyyy'))
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
     FROM costbook c, fieldcrop f
    WHERE     targettype = 'OP'
          AND targetcode = f.fieldcode
          AND intiplasma = 0
          AND :1 - NVL (TO_CHAR (plantingdate, 'yyyy'), :1) >= 4
          AND jobcode LIKE 'P04%'
          AND sourcecode LIKE 'AB%'
          AND sourcetype = 'ST'
          AND tdate BETWEEN TO_DATE ('01' || LPAD ( :2, 2, 0) || :1,
                                     'ddmmyyyy')
                        AND LAST_DAY (
                                TO_DATE ('01' || LPAD ( :2, 2, 0) || :1,
                                         'ddmmyyyy'))
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
     FROM costbook c, fieldcrop f
    WHERE     targettype = 'OP'
          AND targetcode = f.fieldcode
          AND intiplasma = 0
          AND jobcode LIKE 'P05%'
          AND tdate BETWEEN TO_DATE ('01' || LPAD ( :2, 2, 0) || :1,
                                     'ddmmyyyy')
                        AND LAST_DAY (
                                TO_DATE ('01' || LPAD ( :2, 2, 0) || :1,
                                         'ddmmyyyy'))
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
          AND c.budgetyear = :1
          AND f.budgetyear = :1
          AND :1 - NVL (TO_CHAR (plantingdate, 'yyyy'), :1) >= 4
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
                WHEN :1 || LPAD ( :2, 2, '0') <= '202203' THEN 0.1
                ELSE 0.11
            END
              amt,
          'PPN Pupuk Actual'
     FROM costbook c, fieldcrop f
    WHERE     targettype = 'OP'
          AND targetcode = f.fieldcode
          AND intiplasma = 0
          AND :1 - NVL (TO_CHAR (plantingdate, 'yyyy'), :1) >= 4
          AND jobcode LIKE 'P04%'
          AND sourcecode LIKE 'AB%'
          AND sourcetype = 'ST'
          AND tdate BETWEEN TO_DATE ('01' || LPAD ( :2, 2, 0) || :1,
                                     'ddmmyyyy')
                        AND LAST_DAY (
                                TO_DATE ('01' || LPAD ( :2, 2, 0) || :1,
                                         'ddmmyyyy'))
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
ORDER BY 1,
2,
3,
4,
5,
7`

module.exports = Test