const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')
const { query } = require('express')

const summarysheet1 = `SELECT targetcode kode,
ifname,
length_uom,
jobcode jenisperawatan,
getjob_des (jobcode) jobdescription,
SUM (vol) vol,
SUM (cost) cost,
SUM (vol_1) vol_1,
SUM (cost_1) cost_1,
DECODE (SUM (vol_1), 0, 0, SUM (cost_1) / SUM (vol_1)) avg_1,
SUM (bgt_vol) bgt_vol,
SUM (bgt_amt) bgt_amt,
DECODE (SUM (bgt_vol), 0, 0, SUM (bgt_amt) / SUM (bgt_vol)) bgt_avg,
SUM (bgt_vol) - SUM (vol_1) sisa_vol,
SUM (bgt_amt) - SUM (cost_1) sisa_amt, tdate_asset
FROM   (  SELECT   targetcode,
            jobcode,
            0 vol,
            SUM (CASE WHEN EXTRACT (MONTH FROM tdate) = :v_month THEN tvalue ELSE 0 END) cost,
            0 vol_1,
            SUM (tvalue) cost_1,
            0 bgt_vol,
            0 bgt_amt
     FROM   costbook
    WHERE   tdate BETWEEN TO_DATE ('0101' || :v_year, 'ddmmyyyy')
                      AND  LAST_DAY (TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy'))
            AND targettype = 'IF'
            AND jobcode <> get_ctljob ('Infrastructure', '01')
 GROUP BY   targetcode, jobcode
 UNION ALL
   SELECT   kode,
            jenisperawatan,
            SUM (CASE WHEN EXTRACT (MONTH FROM tdate) = :v_month THEN prestasi ELSE 0 END) vol,
            0 cost,
            SUM (prestasi) vol_1,
            0 cost_1,
            0 bgt_vol,
            0 bgt_amt
     FROM   infrastructureprogressdetail
    WHERE   tdate BETWEEN TO_DATE ('0101' || :v_year, 'ddmmyyyy')
                      AND  LAST_DAY (TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy'))
 GROUP BY   kode, jenisperawatan
 UNION ALL
   SELECT   targetcode,
            jobcode,
            0,
            0,
            0,
            0,
            SUM (quantity),
            SUM (debitamount + creditamount)
     FROM   budgettbactivity
    WHERE   budgetyear = :v_year AND targettype = 'IF' AND period <= :v_month
 GROUP BY   targetcode, jobcode) x,
infrastructure y,            (  SELECT   NVL (ifcode, f.fixedassetcode) ifcode, MIN (f.installdate) tdate_asset
     FROM   fafixedasset f, infrastructure i
    WHERE   f.fixedassetcode = i.ifcode(+)
 GROUP BY   ifcode, f.fixedassetcode) f
WHERE       x.targetcode = y.ifcode
AND y.ifcode = f.ifcode(+)
AND y.estate = NVL (:v_estate, y.estate)
AND y.division = NVL (:v_division, y.division)
AND y.iftype = NVL (:v_type, y.iftype)
AND y.ifsubtype = NVL (:v_subtype, y.ifsubtype)
AND y.ifcode = NVL (:v_infracode, y.ifcode)
GROUP BY   targetcode,
ifname,
length_uom,
jobcode,
tdate_asset
ORDER BY   targetcode`

const summarysheet2 =`
SELECT   x.targetcode,
         ifname if_desc,
         x.jobcode,
         getjob_des (x.jobcode) job_desc,
         qty_prog,
         length_uom unitofmeasure,
         sourcetype,
         x.sourcecode,
         w.description src_desc,
         src_uom,
         SUM (vol) qty,
         DECODE (SUM (vol), 0, 0, SUM (x.cost) / SUM (vol)) unitprice,
         SUM (x.cost) tot_amt,
         z.vol_1 vol_1,
         u.cost_1 cost_1,
         u.bgt_vol bgt_vol,
         u.bgt_amt bgt_amt             /*,
                      s.targettype,
                      s.targetcode,
                      s.jobcode*/
  FROM   (  SELECT   sourcetype,
                     sourcecode,
                     targetcode,
                     jobcode,
                     SUM (CASE WHEN referenceno LIKE '%/RTN/%' THEN quantity * -1 ELSE quantity END) vol,
                     SUM (tvalue) cost,
                     0 cost_1,
                     0 bgt_vol,
                     0 bgt_amt,
                     DECODE (sourcetype,
                             'WS', 'JAM',
                             'EM', 'HK',
                             'VH', 'HM/KM',
                             'MA', 'HM',
                             'ST', get_value_pkg.get_purchaseitem_uom_f (purchaseitem),
                             'N/A')
                        src_uom
              FROM   costbook
             WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy')
                               AND  LAST_DAY (TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy'))
                     AND targettype = 'IF'
                     AND jobcode <> get_ctljob ('Infrastructure', '01')
          GROUP BY   sourcetype,
                     sourcecode,
                     targetcode,
                     jobcode,
                     purchaseitem) x,
         infrastructure y,
         (  SELECT   kode,
                     jenisperawatan,
                     SUM (CASE WHEN EXTRACT (MONTH FROM tdate) = :v_month THEN prestasi ELSE 0 END) qty_prog,
                     SUM (prestasi) vol_1
              FROM   infrastructureprogressdetail
             WHERE   tdate BETWEEN TO_DATE ('0101' || :v_year, 'ddmmyyyy')
                               AND  LAST_DAY (TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy'))
          GROUP BY   kode, jenisperawatan) z,
         (  SELECT   targetcode,
                     jobcode,
                     SUM (vol_1) vol_1,
                     SUM (cost_1) cost_1,
                     SUM (bgt_vol) bgt_vol,
                     SUM (bgt_amt) bgt_amt
              FROM   (  SELECT   targetcode,
                                 jobcode,
                                 0 vol_1,
                                 SUM (tvalue) cost_1,
                                 0 bgt_vol,
                                 0 bgt_amt
                          FROM   costbook
                         WHERE   tdate BETWEEN TO_DATE ('0101' || :v_year, 'ddmmyyyy')
                                           AND  LAST_DAY (TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy'))
                                 AND targettype = 'IF'
                                 AND jobcode <> get_ctljob ('Infrastructure', '01')
                      GROUP BY   targetcode, jobcode
                      UNION ALL
                        SELECT   targetcode,
                                 jobcode,
                                 0,
                                 0,
                                 SUM (quantity),
                                 SUM (debitamount + creditamount)
                          FROM   budgettbactivity
                         WHERE   budgetyear = :v_year AND targettype = 'IF'
                      GROUP BY   targetcode, jobcode)
          GROUP BY   targetcode, jobcode) u,
         location w /*,
          (  SELECT   sourcecode,
                      targettype,
                      targetcode,
                      jobcode,
                      SUM (tvalue) cost
               FROM   costbook
              WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy')
                                AND  LAST_DAY (TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy'))
                      AND sourcetype = 'IF'
                      AND jobcode <> get_ctljob ('Infrastructure', '01')
           GROUP BY   targettype,
                      targetcode,
                      sourcecode,
                      jobcode) s*/
 WHERE       x.targetcode = y.ifcode
         AND y.estate = NVL (:v_estate, y.estate)
         AND y.division = NVL (:v_division, y.division)
         AND y.iftype = NVL (:v_type, y.iftype)
         AND y.ifsubtype = NVL (:v_subtype, y.ifsubtype)
         AND x.targetcode = NVL (:v_infracode, x.targetcode)
         AND x.targetcode = Z.kode(+)
         AND x.jobcode = z.jenisperawatan(+)
         AND x.targetcode = u.targetcode(+)
         AND x.jobcode = u.jobcode(+)
         AND x.sourcetype = w.locationtypecode(+)
         AND x.sourcecode = w.locationcode(+)
--AND x.targetcode = s.sourcecode
GROUP BY   x.targetcode,
         ifname,
         length_uom,
         z.vol_1,
         u.cost_1,
         u.bgt_vol,
         u.bgt_amt,
         x.jobcode,
         qty_prog,
         sourcetype,
         x.sourcecode,
         w.description,
         src_uom                       /*,
                                s.targettype,
                                s.targetcode,
                                s.jobcode*/
ORDER BY   x.targetcode, x.jobcode`



const summarysheet3 =`select jobcode, job_desc, sum(qty_prog) tot_qty_prog,sum(tot_amt)  tot_tot_amt from (
    SELECT   x.targetcode,
             ifname if_desc,
             x.jobcode,
             getjob_des (x.jobcode) job_desc,
             qty_prog,
             length_uom unitofmeasure,
             sourcetype,
             sourcecode,
             w.description src_desc,
             src_uom,
             SUM (vol) qty,
             DECODE (SUM (vol), 0, 0, SUM (cost) / SUM (vol)) unitprice,
             SUM (cost) tot_amt,
             z.vol_1 vol_1,
             u.cost_1 cost_1,
             u.bgt_vol bgt_vol,
             u.bgt_amt bgt_amt
      FROM   (  SELECT   sourcetype,
                         sourcecode,
                         targetcode,
                         jobcode,
                         SUM (quantity) vol,
                         SUM (tvalue) cost,
                         0 cost_1,
                         0 bgt_vol,
                         0 bgt_amt,
                         DECODE (sourcetype,
                                 'WS', 'JAM',
                                 'EM', 'HK',
                                 'VH', 'HM/KM',
                                 'MA', 'HM',
                                 'ST', get_value_pkg.get_purchaseitem_uom_f (purchaseitem),
                                 'N/A')
                            src_uom
                  FROM   costbook
                 WHERE   tdate BETWEEN TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy')
                                   AND  LAST_DAY (TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy'))
                         AND targettype = 'IF'
                         AND jobcode <> get_ctljob ('Infrastructure', '01')
              GROUP BY   sourcetype,
                         sourcecode,
                         targetcode,
                         jobcode,
                         purchaseitem) x,
             infrastructure y,
             (  SELECT   kode,
                         jenisperawatan,
                         SUM (CASE WHEN EXTRACT (MONTH FROM tdate) = :v_month THEN prestasi ELSE 0 END) qty_prog,
                         SUM (prestasi) vol_1
                  FROM   infrastructureprogressdetail
                 WHERE   tdate BETWEEN TO_DATE ('0101' || :v_year, 'ddmmyyyy')
                                   AND  LAST_DAY (TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy'))
              GROUP BY   kode, jenisperawatan) z,
             (             select targetcode, jobcode, sum(vol_1) vol_1, sum(cost_1) cost_1, sum(bgt_vol) bgt_vol, sum(bgt_amt) bgt_amt
             from
             (
             SELECT   targetcode,
                         jobcode,
                         0 vol_1,
                         SUM (tvalue) cost_1,
                         0 bgt_vol,
                         0 bgt_amt
                  FROM   costbook
                 WHERE   tdate BETWEEN TO_DATE ('0101' || :v_year, 'ddmmyyyy')
                                   AND  LAST_DAY (TO_DATE ('01' || LPAD (:v_month, 2, 0) || :v_year, 'ddmmyyyy'))
                         AND targettype = 'IF'
                         AND jobcode <> get_ctljob ('Infrastructure', '01')
              GROUP BY   targetcode, jobcode
              UNION ALL
                SELECT   targetcode,
                         jobcode,
                         0,
                         0,
                         SUM (quantity),
                         SUM (debitamount + creditamount)
                  FROM   budgettbactivity
                 WHERE   budgetyear = :v_year AND targettype = 'IF'
              GROUP BY   targetcode, jobcode
              ) group by targetcode, jobcode) u,
             location w
     WHERE       x.targetcode = y.ifcode
             AND y.estate = NVL (:v_estate, y.estate)
             AND y.division = NVL (:v_division, y.division)
             AND y.iftype = NVL (:v_type, y.iftype)
             AND y.ifsubtype = NVL (:v_subtype, y.ifsubtype)
             AND y.ifcode = NVL (:v_infracode, y.ifcode)
             AND x.targetcode = Z.kode(+)
             AND x.jobcode = z.jenisperawatan(+)
             AND x.targetcode = u.targetcode(+)
             AND x.jobcode = u.jobcode(+)
             AND x.sourcetype = w.locationtypecode(+)
             AND x.sourcecode = w.locationcode(+)
  GROUP BY   x.targetcode,
             ifname,
             length_uom,
             z.vol_1,
             u.cost_1,
             u.bgt_vol,
             u.bgt_amt,
             x.jobcode,
             qty_prog,
             sourcetype,
             sourcecode,
             w.description,
             src_uom
  )
  group by jobcode, job_desc
  order by jobcode
  `


const fetchDataDynamic = async function (users, find, callback,) {
    let firstsheet,secondsheet, error, queryStatement1,queryStatement2,bindStatement

// console.log(find)
    // // custom code
    if (find.report === '1-RPT_BIAYA_INFRASTRUKTUR_SUM.RDF') {
        queryStatement1 = summarysheet1
        // querysum2 = summarysheet2
    } else {
        queryStatement1 = summarysheet2
        queryStatement2 = summarysheet3
    }



    // if (find.P_DIV === 'A'){
        // _.set(find,'P_DIV','')
        bindStatement = _.pick(find, ['V_MONTH', 'V_YEAR', 'V_ESTATE', 'V_DIVISION','V_TYPE','V_SUBTYPE','V_INFRACODE'])
    // } else {
        // bindStatement = _.pick(find, ['P_DIV', 'P_YEAR', 'P_MONTH', 'P_MONTH2'])
    // }

    try {
        if (find.report === '1-RPT_BIAYA_INFRASTRUKTUR_SUM.RDF') {
            firstsheet = await database.executeStmt(users, queryStatement1,bindStatement)
        } else {
            firstsheet = await database.executeStmt(users, queryStatement1,bindStatement)
            secondsheet = await database.executeStmt(users, queryStatement2,bindStatement)
        }

    } catch (errors) {

        error = errors
    }

    // console.log("res1",firstsheet);
    // console.log("res2",secondsheet);
    if (find.report === '1-RPT_BIAYA_INFRASTRUKTUR_SUM.RDF'){
        callback(error, firstsheet)
    } else {
        callback(error, firstsheet,secondsheet)
    }
}


module.exports = {
    fetchDataDynamic
}
