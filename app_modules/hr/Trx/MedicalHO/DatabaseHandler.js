const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuerya = `Select hm.rowid"rowid",
hm.empcode "empcode",get_empname(hm.empcode) "empname",
emp.employeetype"emptype",
emp.maritalstatus "maritalstatus",
hm.kategori"kategori",hm.kelas_ri"kelas_ri",
hm.plafon"plafon",
hm.kodepasien"kodepasien",hm.namapasien"namapasien",
hm.noref"noref",
to_char(hm.tglref, 'dd-mm-yyyy') "tglref",
hm.documentno"documentno",
to_char(hm.tglclaim, 'dd-mm-yyyy') "tglclaim",
hm.rekammedis"rekammedis",
hm.keterangan"keterangan",
hm.biaya_actual"biaya_actual",
hm.biaya_kamar"biaya_kamar",
hm.biaya_obat"biayaobat",
hm.biaya"biaya",
hm.inputby,
to_char(hm.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
hm.updateby"updateby",
to_char(hm.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
from hr_medical hm ,empmasterepms emp
where hm.empcode=emp.empcode and (hm.empcode LIKE UPPER ('%' || :search || '%'))
order by hm.inputdate DESC
`

const baseQuery = `  SELECT emp.ROWID "rowid",
emp.empcode "empcode",
emp.empname "empname",
emp.employeetype "emptype",
DECODE (EMP.maritalstatus, '0', 'Lajang', 'Menikah') "maritalstatus",
EMP.GRADE1  "golongan",
emp.datejoin "tmk",
CASE
    WHEN SUBSTR (GROUPCODE, 0, INSTR (GROUPCODE, '-') - 1) = 'USTP'
THEN
    emp.costcenter
ELSE
    SUBSTR (GROUPCODE, 0, INSTR (GROUPCODE, '-') - 1)
END "costcenter",
mp.description "jabatan"
FROM empmasterepms emp,mas_position mp
WHERE     emp.id_position = mp.code
AND getcompany ('COMP_CODE') =
SUBSTR (GROUPCODE, 0, INSTR (GROUPCODE, '-') - 1)
AND DATETERMINATE IS NULL
AND (   UPPER (emp.empcode) LIKE UPPER ('%' || :search || '%')
 OR UPPER (emp.empname) LIKE UPPER ('%' || :search || '%'))
ORDER BY emp.empcode`

const detailQuery = `SELECT hm.ROWID
"rowid",
hm.empcode
"empcode",
get_empname (hm.empcode)
"empnamedisplayonly",
hm.kategori
"kategori",
get_apps_paramvalue ('Employee', 'EP087', hm.kategori)
"kategori_ket",
hm.kelas_ri
"kelas_ri#code",
get_med_cat_levels (hm.kategori, hm.kelas_ri)
"kelas_ri#description",
hm.plafon
"plafon",
hm.kodepasien
"kodepasien",
hm.namapasien
"namapasien",
hm.noref
"noref",
TO_CHAR (hm.tglclaim, 'yyyy')
"periode_pengobatan",
TO_CHAR (hm.tglref, 'dd-mm-yyyy')
"tglref",
hm.documentno
"documentno",
hm.pa_number
"pa_number",
TO_CHAR (hm.tglclaim, 'dd-mm-yyyy')
"tglclaim",
medical_plafond_balance (hm.empcode,
                     hm.tglclaim,
                     hm.kategori,
                     hm.kelas_ri,
                     HM.DOCUMENTNO,
                     hm.plafon)
"plafond_balance",
hm.rekammedis
"rekammedis",
hm.keterangan
"keterangan",
hm.biaya_actual
"biaya_actual",
hm.biaya_kamar
"biaya_kamar",
hm.biaya_obat
"biayaobat",
hm.biaya
"biaya",
CASE
WHEN     NVL (hm.process_flag, 'CREATED') = 'CREATED'
     AND pa_number IS NOT NULL
THEN
    'SUBMITED'
ELSE
    NVL (hm.process_flag, 'CREATED')
END
"process_flag",
hm.inputby,
TO_CHAR (hm.inputdate, 'dd-mm-yyyy hh24:mi')
"inputdate",
hm.updateby
"updateby",
TO_CHAR (hm.updatedate, 'dd-mm-yyyy hh24:mi')
"updatedate",
v_url_preview_site (
    'MDHO',
    CASE
        WHEN process_flag IS NULL THEN 'CREATED'
        ELSE 'APPROVED'
    END)
|| pa_number
|| '&P_BUAT='
|| GET_PARAMETERVALUE ('HR', 'HRM21', case when g.description like '%MILL%' THEN 'USER-M' ELSE 'USER' END )
|| '&P_TAU='
|| GET_PARAMETERVALUE ('HR', 'HRM21', case when g.description like '%MILL%' THEN 'AUTH1-M' ELSE 'AUTH1' END )
|| '&P_SETUJU='
|| GET_PARAMETERVALUE ('HR', 'HRM21', case when g.description  like '%MILL%' THEN 'AUTH2-M' ELSE 'AUTH2' END )
 "v_url_preview"
FROM hr_medical hm, empmasterepms e, mas_position m , group_position g
WHERE hm.empcode = :empcode AND e.empcode = hm.empcode and m.code = e.id_position and m.groupcode = g.groupcode
ORDER BY hm.inputdate DESC`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}
    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)
    } catch (error) {
        callback(error, '')
    }
    callback('', result)
}

const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    /**
   * ! change the parameters according to the table
   */
    binds.empcode = (!params.empcode ? '' : params.empcode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}


const generatePA = async function (users, params) {
    return new Promise(async (resolve, reject) => {

        binds = {}

        /**
       * ! change the parameters according to the table
       */
        binds.empcode = (!params.empcode ? '' : params.empcode)
        binds.documentno = (!params.documentno ? '' : params.documentno)
        binds.inputby = (!users.loginid ? '' : users.loginid)
        binds.panumber = { dir: oracledb.BIND_OUT, type: oracledb.STRING }

        let result

        console.log(users.loginid)

        //    (users, statement, binds, opts = {})
        try {

            const stmt = `BEGIN
         :panumber := generate_pa ( :documentno, :empcode, :inputby);
         END; `

            result = await database.siteExecuteDynamicBinds(users, stmt, binds)

        } catch (error) {
            reject(error)
        }

        resolve(result)
    })
}


module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    generatePA
}


