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

const summarysheet2 =`select distinct (a.jobcode),b.jobdescription ,sum (a.tvalue) amount
from costbook a ,job b ,periodctlmst c
where c.ACCYEAR = :p_year
 and c.periodseq = :p_month
 and a.tdate between  c.STARTDATE and c.ENDDATE
 and targetcode in (select sourcecode from cacostpool where allocationcode in 
                   (select allocationcode from cabalancing where main||sub ='732001'))
 and a.jobcode  not like '732%'                     
 and a.jobcode =b.jobcode
group by a.jobcode,b.jobdescription
order by a.jobcode`



const fetchDataDynamic = async function (users, find, callback,) {
    let firstsheet,secondsheet, error, queryStatement1,queryStatement2,bindStatement

// console.log(find)
    // // custom code
    if (find.report === 'rpt_foh_estate.rdf') {
        queryStatement1 = summarysheet1
        // querysum2 = summarysheet2
    } else {
        queryStatement1 = summarysheet2
    }



    // if (find.P_DIV === 'A'){
        // _.set(find,'P_DIV','')
        bindStatement = _.pick(find, ['P_MONTH', 'P_YEAR'])
    // } else {
        // bindStatement = _.pick(find, ['P_DIV', 'P_YEAR', 'P_MONTH', 'P_MONTH2'])
    // }

    try {
        if (find.report === 'rpt_foh_estate.rdf') {
            firstsheet = await database.executeStmt(users, queryStatement1,bindStatement)
        } else {
            firstsheet = await database.executeStmt(users, queryStatement1,bindStatement)
        }

    } catch (errors) {

        error = errors
    }

    // console.log("res1",firstsheet);
    // console.log("res2",secondsheet);
        callback(error, firstsheet)
}


module.exports = {
    fetchDataDynamic
}
