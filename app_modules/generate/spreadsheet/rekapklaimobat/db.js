const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `  SELECT COSTCENTER,
PA_NUMBER,
TGLREF,
TGLCLAIM,
EMPCODE,
EMPNAME,
NAMAPASIEN,
PATIENT,
NOREF,
REKAMMEDIS,
biaya,
exclude_plafond,keterangan
FROM (SELECT E.COSTCENTER,
        H.PA_NUMBER,
        H.TGLREF,
        H.TGLCLAIM,
        H.EMPCODE,
        EMPNAME,
        NAMAPASIEN,
        GET_APPS_PARAMVALUE ('Employee', 'EP088', KODEPASIEN)
            PATIENT,
           GET_APPS_PARAMVALUE ('Employee', 'EP087', KATEGORI)
        || CASE
               WHEN KATEGORI = 'RJ' THEN DECODE ( NVL (KELAS_RI, 'RJG') , 'RJG' , '',' - Kehamilan & Anak')
               ELSE NULL
           END
            NOREF,
        REKAMMEDIS,
        biaya,
        CASE
            WHEN NVL (exclude_plafond, '0') = '1' THEN 'IYA'
            ELSE 'TIDAK'
        END
            EXCLUDE_PLAFOND,h.keterangan
   FROM HR_MEDICAL H, EMPMASTEREPMS E
  WHERE TO_CHAR (TGLCLAIM, 'YYYY') = :P_YEAR AND H.EMPCODE = E.EMPCODE)
ORDER BY EMPCODE, TGLREF`




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
