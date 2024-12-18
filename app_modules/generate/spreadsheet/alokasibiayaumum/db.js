const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `  /* Formatted on 24/01/2018 14:00:48 (QP5 v5.115.810.9015) */
/* Formatted on 29/01/2018 16:22:48 (QP5 v5.115.810.9015) */
  SELECT   JOBCODE,
           getjob_des (jobcode) jobdesc,
           SUM (TOTAL) TOTAL,
           SUM (TM) TM,
           SUM (TBM) TBM,
           SUM (P_TM) P_TM,
           SUM (P_TBM) P_TBM,
           SUM (BIBITAN) BIBITAN,
           SUM (PKS) PKS,
           SUM (OH) OH,
           SUM (VARIAN) VARIAN,
           SUM (B_TOTAL) B_TOTAL,
           SUM (B_TM) B_TM,
           SUM (B_TBM) B_TBM,
           SUM (B_P_TM) B_P_TM,
           SUM (B_P_TBM) B_P_TBM,
           SUM (B_PKS) B_PKS,
           SUM (B_OH) B_OH
    FROM   (SELECT   a.jobcode,
                     total,
                     tm,
                     tbm,
                     p_tm,
                     p_tbm,
                     bibitan,
                     pks,
                     oh,
                     ROUND(  total
                           - NVL (tm, 0)
                           - NVL (tbm, 0)
                           - NVL (bibitan, 0)
                           - NVL (pks, 0)
                           - NVL (oh, 0)
                           - NVL (p_tbm, 0)
                           - NVL (p_tm, 0))
                        varian,
                     0 B_TOTAL,
                     0 B_TM,
                     0 B_TBM,
                     0 B_P_TM,
                     0 B_P_TBM,
                     0 B_PKS,
                     0 B_OH
              FROM   (  SELECT   jobcode,
                                 SUM (debitamount) + SUM (creditamount) total,
                                 SUM (DECODE (targetcode, '11ZU', debitamount + creditamount, 0)) bibitan,
                                 SUM (CASE
                                         WHEN     SUBSTR (targetcode, 1, 1) = '3'
                                              AND targetcode NOT IN ('31TK', '31LG', '32TK', '31PB')
                                              AND (SELECT   pks
                                                     FROM   yearpks
                                                    WHERE   year = :P_YEAR) = 1
                                         THEN
                                            debitamount + creditamount
                                         ELSE
                                            0
                                      END)
                                    pks,
                                 SUM (CASE
                                         WHEN SUBSTR (targetcode, 1, 1) = '2' THEN debitamount + creditamount
                                         WHEN SUBSTR (targetcode, 1, 1) = 'P' THEN debitamount + creditamount
                                         ELSE 0
                                      END)
                                    plasma,
                                 SUM (CASE
                                         WHEN SUBSTR (targetcode, 1, 1) = '9' THEN debitamount + creditamount
                                         WHEN targetcode = 'CB' THEN debitamount + creditamount
                                         ELSE 0
                                      END)
                                    oh
                          FROM   tbactivity
                         WHERE       period BETWEEN :P_MONTH AND :P_MONTH2
                                 AND fiscalyear = :P_YEAR
                                 AND targettype IN ('GC', 'CB')
                                 AND jobcode BETWEEN '60000000' AND '91100000'
                                 AND SUBSTR (jobcode, 1, 1) <> 'A'
                      GROUP BY   jobcode) a,
                     (  SELECT   jobcode_source jobcode, SUM (maturecost) tm, SUM (immaturecost) tbm
                          FROM   rpt_temp_allocation
                         WHERE       month BETWEEN :P_MONTH AND :P_MONTH2
                                 AND SUBSTR (costcentercode, 1, 1) NOT IN ('P', '2')
                                 AND NOT EXISTS (SELECT   1
                                                   FROM   kelompoktani
                                                  WHERE   targetcode = kelompoktanicode)
                                 AND year = :P_YEAR
                      GROUP BY   jobcode_source) b,
                     (  SELECT   jobcode_source jobcode, SUM (maturecost) p_tm, SUM (immaturecost) p_tbm
                          FROM   rpt_temp_allocation
                         WHERE       month BETWEEN :P_MONTH AND :P_MONTH2
                                 AND (SUBSTR (costcentercode, 1, 1) IN ('P', '2')
                                      OR EXISTS (SELECT   1
                                                   FROM   kelompoktani
                                                  WHERE   targetcode = kelompoktanicode))
                                 AND year = :P_YEAR
                      GROUP BY   jobcode_source) c
             WHERE   a.jobcode = b.jobcode(+) AND a.jobcode = c.jobcode(+)
            UNION ALL
              SELECT   JOBCODE,
                       0 TOTAL,
                       0 TM,
                       0 TBM,
                       0 P_TM,
                       0 P_TBM,
                       0 BIBITAN,
                       0 PKS,
                       0 OH,
                       0 VARIAN,
                       SUM (B_TOTAL) B_TOTAL,
                       SUM (B_TM) B_TM,
                       SUM (B_TBM) B_TBM,
                       SUM (B_P_TM) B_P_TM,
                       SUM (B_P_TBM) B_P_TBM,
                       SUM (B_PKS) B_PKS,
                       SUM (B_OH) B_OH
                FROM   (  SELECT   jobcode,
                                   period,
                                   (SUM (debitamount) + SUM (creditamount)) * 1000 b_total,
                                   0 b_tm,
                                   0 b_tbm,
                                   0 b_p_tm,
                                   0 b_p_tbm,
                                   0 b_pks,
                                   0 b_oh
                            FROM   budgettbactivity
                           WHERE   period BETWEEN :P_MONTH AND :P_MONTH2 AND budgetyear = :P_YEAR AND targettype = 'GC'
                        GROUP BY   jobcode, period
                        UNION ALL
                          SELECT   jobcode,
                                   x.period,
                                   0,
                                   0 b_tm,
                                   (SUM (debitamount) + SUM (creditamount)) * 1000 * ha / total b_tbm,
                                   0 b_p_tm,
                                   0 b_p_tbm,
                                   0 b_pks,
                                   0 b_oh
                            FROM   budgettbactivity x,
                                   (  SELECT   accyear budgetyear,
                                               periodseq period,
                                               SUM (SUM (NVL (ha, 0))) OVER (PARTITION BY accyear ORDER BY periodseq) ha
                                        FROM   V_BUDGETMASTERBLOCK_DISTR, periodctlmst
                                       WHERE       budgetyear(+) = accyear
                                               AND periodseq <= :P_MONTH2
                                               AND period(+) = periodseq
                                               AND accyear = :P_YEAR
                                               AND umur(+) < 4
                                               AND intiplasma(+) = 1
                                    GROUP BY   accyear, periodseq) y,
                                   (  SELECT   accyear budgetyear,
                                               periodseq period,
                                               SUM (SUM (NVL (ha, 0))) OVER (PARTITION BY accyear ORDER BY periodseq) total
                                        FROM   V_BUDGETMASTERBLOCK_DISTR, periodctlmst
                                       WHERE       budgetyear(+) = accyear
                                               AND periodseq <= :P_MONTH2
                                               AND period(+) = periodseq
                                               AND accyear = :P_YEAR
                                               AND intiplasma(+) = 1
                                    GROUP BY   accyear, periodseq) z
                           WHERE       x.period BETWEEN :P_MONTH AND :P_MONTH2
                                   AND x.budgetyear = :P_YEAR
                                   AND x.targettype = 'GC'
                                   AND targetcode LIKE '1%'
                                   AND x.period = y.period
                                   AND x.period = z.period
                        GROUP BY   x.period,
                                   jobcode,
                                   ha,
                                   total
                        UNION ALL
                          SELECT   jobcode,
                          x.period,
                                   0,
                                   (SUM (debitamount) + SUM (creditamount)) * 1000 * ha / total b_tm,
                                   0 b_tbm,
                                   0 b_p_tm,
                                   0 b_p_tbm,
                                   0 b_pks,
                                   0 b_oh
                            FROM   budgettbactivity x,
                                   (  SELECT   accyear budgetyear,
                                               periodseq period,
                                               SUM (SUM (NVL (ha, 0))) OVER (PARTITION BY accyear ORDER BY periodseq) ha
                                        FROM   V_BUDGETMASTERBLOCK_DISTR, periodctlmst
                                       WHERE       budgetyear(+) = accyear
                                               AND periodseq <= :P_MONTH2
                                               AND period(+) = periodseq
                                               AND accyear = :P_YEAR
                                               AND umur(+) >= 4
                                               AND intiplasma(+) = 1
                                    GROUP BY   accyear, periodseq) y,
                                   (  SELECT   accyear budgetyear,
                                               periodseq period,
                                               SUM (SUM (NVL (ha, 0))) OVER (PARTITION BY accyear ORDER BY periodseq) total
                                        FROM   V_BUDGETMASTERBLOCK_DISTR, periodctlmst
                                       WHERE       budgetyear(+) = accyear
                                               AND periodseq <= :P_MONTH2
                                               AND period(+) = periodseq
                                               AND accyear = :P_YEAR
                                               AND intiplasma(+) = 1
                                    GROUP BY   accyear, periodseq) z
                           WHERE       x.period BETWEEN :P_MONTH AND :P_MONTH2
                                   AND x.budgetyear = :P_YEAR
                                   AND x.targettype = 'GC'
                                   AND targetcode LIKE '1%'
                                   AND x.period = y.period
                                   AND x.period = z.period
                        GROUP BY   jobcode, ha, total, x.period
                        UNION ALL
                          SELECT   jobcode,
                          x.period,
                                   0,
                                   0 b_tm,
                                   0 b_tbm,
                                   (SUM (debitamount) + SUM (creditamount)) * 1000 * ha / total b_p_tm,
                                   0 b_p_tbm,
                                   0 b_pks,
                                   0 b_oh
                            FROM   budgettbactivity x,
                                   (  SELECT   accyear budgetyear,
                                               periodseq period,
                                               SUM (SUM (NVL (ha, 0))) OVER (PARTITION BY accyear ORDER BY periodseq) ha
                                        FROM   V_BUDGETMASTERBLOCK_DISTR, periodctlmst
                                       WHERE       budgetyear(+) = accyear
                                               AND periodseq <= :P_MONTH2
                                               AND period(+) = periodseq
                                               AND accyear = :P_YEAR
                                               AND umur(+) >= 4
                                               AND intiplasma(+) = 0
                                    GROUP BY   accyear, periodseq) y,
                                   (  SELECT   accyear budgetyear,
                                               periodseq period,
                                               SUM (SUM (NVL (ha, 0))) OVER (PARTITION BY accyear ORDER BY periodseq) total
                                        FROM   V_BUDGETMASTERBLOCK_DISTR, periodctlmst
                                       WHERE       budgetyear(+) = accyear
                                               AND periodseq <= :P_MONTH2
                                               AND period(+) = periodseq
                                               AND accyear = :P_YEAR
                                               AND intiplasma(+) = 0
                                    GROUP BY   accyear, periodseq) z
                           WHERE       x.period BETWEEN :P_MONTH AND :P_MONTH2
                                   AND x.budgetyear = :P_YEAR
                                   AND x.targettype = 'GC'
                                   AND targetcode LIKE '2%'
                                   AND x.period = y.period
                                   AND x.period = z.period
                        GROUP BY   jobcode, ha, total, x.period
                        UNION ALL
                          SELECT   jobcode,
                          x.period, 
                                   0,
                                   0 b_tm,
                                   0 b_tbm,
                                   0 b_p_tm,
                                   (SUM (debitamount) + SUM (creditamount)) * 1000 * ha / total b_p_tbm,
                                   0 b_pks,
                                   0 b_oh
                            FROM   budgettbactivity x,
                                   (  SELECT   accyear budgetyear,
                                               periodseq period,
                                               SUM (SUM (NVL (ha, 0))) OVER (PARTITION BY accyear ORDER BY periodseq) ha
                                        FROM   V_BUDGETMASTERBLOCK_DISTR, periodctlmst
                                       WHERE       budgetyear(+) = accyear
                                               AND periodseq <= :P_MONTH2
                                               AND period(+) = periodseq
                                               AND accyear = :P_YEAR
                                               AND umur(+) < 4
                                               AND intiplasma(+) = 0
                                    GROUP BY   accyear, periodseq) y,
                                   (  SELECT   accyear budgetyear,
                                               periodseq period,
                                               SUM (SUM (NVL (ha, 0))) OVER (PARTITION BY accyear ORDER BY periodseq) total
                                        FROM   V_BUDGETMASTERBLOCK_DISTR, periodctlmst
                                       WHERE       budgetyear(+) = accyear
                                               AND periodseq <= :P_MONTH2
                                               AND period(+) = periodseq
                                               AND accyear = :P_YEAR
                                               AND intiplasma(+) = 0
                                    GROUP BY   accyear, periodseq) z
                           WHERE       x.period BETWEEN :P_MONTH AND :P_MONTH2
                                   AND x.budgetyear = :P_YEAR
                                   AND x.targettype = 'GC'
                                   AND targetcode LIKE '2%'
                                   AND x.period = y.period
                                   AND x.period = z.period
                        GROUP BY   jobcode, ha, total, x.period
                        UNION ALL
                          SELECT   jobcode,
                          0 period ,
                                   0 b_total,
                                   0 b_tm,
                                   0 b_tbm,
                                   0 b_p_tm,
                                   0 b_p_tbm,
                                   0 b_pks,
                                   (SUM (debitamount) + SUM (creditamount)) * 1000 b_oh
                            FROM   budgettbactivity
                           WHERE       period BETWEEN :P_MONTH AND :P_MONTH2
                                   AND budgetyear = :P_YEAR
                                   AND targettype = 'GC'
                                   AND targetcode LIKE '9%'
                        GROUP BY   jobcode
                        UNION ALL
                          SELECT   jobcode,
                          0 period,
                                   0 b_total,
                                   0 b_tm,
                                   0 b_tbm,
                                   0 b_p_tm,
                                   0 b_p_tbm,
                                   (SUM (debitamount) + SUM (creditamount)) * 1000 b_pks,
                                   0 b_oh
                            FROM   budgettbactivity
                           WHERE       period BETWEEN :P_MONTH AND :P_MONTH2
                                   AND budgetyear = :P_YEAR
                                   AND targettype = 'GC'
                                   AND targetcode LIKE '3%'
                        GROUP BY   jobcode)
            GROUP BY   jobcode)
GROUP BY   jobcode
ORDER BY   1`




const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


  ///  let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['P_YEAR', 'P_MONTH', 'P_MONTH2'])

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
