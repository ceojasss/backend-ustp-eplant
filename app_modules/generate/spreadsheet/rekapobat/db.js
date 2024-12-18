const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `  SELECT e.empcode,
empname,
M.description,
CASE
        WHEN getcompany ('COMP_CODE') = 'USTP' THEN costcenter
        ELSE g.groupcode
END
        costcenter,
datejoin,
DECODE (sex, '0', 'PRIA', 'WANITA')
        jenkel,
DECODE (maritalstatus,  '1', 'MENIKAH',  '0', 'LAJANG')
        statuspernikahan,
hitung_umur_detail (datejoin, TRUNC (SYSDATE))
        masakerja,
grade1
        gol,
   grade1
|| '-'
|| CASE
           WHEN maritalstatus = '1' AND sex = '0' THEN 'MENIKAH'
           WHEN maritalstatus = '1' AND sex = '1' THEN 'LAJANG'
           WHEN maritalstatus = '0' THEN 'LAJANG'
   END
        gol_medical,
plafond,
bal_amt,
rj.rawatjalan,
plafond - rj.rawatjalan - (plafond - NVL (bal_amt, 0))
        sisa,
  NVL (rj.b_01, 0)
+ CASE
          WHEN NVL (bal_amt, 0) = 0 THEN 0
          ELSE (plafond - NVL (bal_amt, 0))
  END
        b_01,
rj.b_02,
rj.b_03,
rj.b_04,
rj.b_05,
rj.b_06,
rj.b_07,
rj.b_08,
rj.b_09,
rj.b_10,
rj.b_11,
rj.b_12,
RI.rawatinap,
lahir,
kacamata,
kehamilananak,
kehamilananak_plafond,
dateterminate
FROM empmasterepms     E,
hr_medical_plafond P,
mas_position      M,
group_position    g,
(  SELECT empcode,
          SUM (biaya)
                  rawatjalan,
          SUM (DECODE (EXTRACT (MONTH FROM tglclaim), '1', biaya, NULL))
                  b_01,
          SUM (DECODE (EXTRACT (MONTH FROM tglclaim), '2', biaya, NULL))
                  b_02,
          SUM (DECODE (EXTRACT (MONTH FROM tglclaim), '3', biaya, NULL))
                  b_03,
          SUM (DECODE (EXTRACT (MONTH FROM tglclaim), '4', biaya, NULL))
                  b_04,
          SUM (DECODE (EXTRACT (MONTH FROM tglclaim), '5', biaya, NULL))
                  b_05,
          SUM (DECODE (EXTRACT (MONTH FROM tglclaim), '6', biaya, NULL))
                  b_06,
          SUM (DECODE (EXTRACT (MONTH FROM tglclaim), '7', biaya, NULL))
                  b_07,
          SUM (DECODE (EXTRACT (MONTH FROM tglclaim), '8', biaya, NULL))
                  b_08,
          SUM (DECODE (EXTRACT (MONTH FROM tglclaim), '9', biaya, NULL))
                  b_09,
          SUM (
                  DECODE (EXTRACT (MONTH FROM tglclaim),
                          '10', biaya,
                          NULL))
                  b_10,
          SUM (
                  DECODE (EXTRACT (MONTH FROM tglclaim),
                          '11', biaya,
                          NULL))
                  b_11,
          SUM (
                  DECODE (EXTRACT (MONTH FROM tglclaim),
                          '12', biaya,
                          NULL))
                  b_12
     FROM hr_medical
    WHERE     EXTRACT (YEAR FROM tglclaim) = :p_year
          AND kategori = 'RJ'
          AND NVL (KELAS_RI, 'RJG') = 'RJG'
 GROUP BY empcode) rj,
(  SELECT empcode, SUM (biaya) rawatinap
     FROM hr_medical
    WHERE EXTRACT (YEAR FROM tglclaim) = :p_year AND kategori = 'RI'
 GROUP BY empcode) ri,
(  SELECT empcode, SUM (biaya) lahir
     FROM hr_medical
    WHERE EXTRACT (YEAR FROM tglclaim) = :p_year AND kategori = 'LH'
 GROUP BY empcode) lh,
(  SELECT empcode, SUM (biaya) kacamata
     FROM hr_medical
    WHERE EXTRACT (YEAR FROM tglclaim) = :p_year AND kategori = 'KM'
 GROUP BY empcode) km,
(  SELECT empcode,
          PLAFOND             kehamilananak_PLAFOND,
          SUM (biaya)         kehamilananak
     FROM hr_medical HM, HR_MEDICAL_PLAFOND HP
    WHERE     EXTRACT (YEAR FROM tglclaim) = :p_year
          AND kategori = 'RJ'
          AND NVL (KELAS_RI, 'RJG') = 'RJM'
          AND CATEGORIES = KATEGORI
          AND SUBCATEGORIES = 'RJM'
 GROUP BY empcode, PLAFOND) rjm,
(SELECT EMPCODE, AMOUNT bal_amt
   FROM MEDICAL_BALANCE
  WHERE p_year = :P_YEAR) bal
WHERE     (   (    NVL (othername, 'XYZ') = 'HO'
         AND getcompany ('COMP_CODE') = 'USTP')
     OR (    NVL (othername, 'XYZ') <> 'HO'
         AND g.groupcode LIKE '%' || getcompany ('COMP_CODE') || '%')) --'%'||getcompany ('COMP_CODE')||'%' like '%'||g.description||'%' ))
AND E.GRADE1 IS NOT NULL
AND e.empcode = rj.empcode(+)
AND e.empcode = ri.empcode(+)
AND e.empcode = km.empcode(+)
AND e.empcode = lh.empcode(+)
AND E.EMPCODE = rjm.empcode(+)
AND e.empcode = bal.empcode(+)
AND categories(+) = 'RJ'
AND grade1 = p.code(+)
AND m.code = e.id_position
AND m.groupcode = g.groupcode
AND e.dateterminate IS NULL
AND p.inactive IS NULL
AND   NVL (TO_NUMBER (TO_CHAR (DATETERMINATE, 'YYYY')), :P_YEAR)
    - :P_YEAR =
    0
AND DECODE (maritalstatus,  '1', 'MENIKAH',  '0', 'LAJANG') =
    p.description(+)
AND sex =
    CASE
            WHEN SUBCATEGORIES(+) = 'KARYAWATI' THEN 1
            WHEN SUBCATEGORIES(+) = 'KARYAWAN' THEN 0
            WHEN SUBCATEGORIES(+) IS NULL THEN sex
    END
ORDER BY id_position, empcode`




const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


    // let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['P_YEAR'])

    try {
        result = await database.executeStmt(users,  queryStatement, bindStatement)

    } catch (errors) {

        error = errors
    }


    callback(error, result)
}


module.exports = {
    fetchDataDynamic
}
