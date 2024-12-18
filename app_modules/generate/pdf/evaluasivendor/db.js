const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `SELECT v.ROWID
"rowid",
ld.rowid "legalrowid",
v.suppliercode
"suppliercode",
NVL (v.process_flag, 'UNVERIFIED')
"verified",
NVL (LD.process_flag, 'UNVERIFIED')
"legal_verified",
CASE
WHEN v.process_flag IS NULL AND ld.process_flag IS NULL
THEN
        'UNVERIFIED'
WHEN v.process_flag IS NOT NULL AND ld.process_flag IS NULL
THEN
        'PROCUREMENT VERIFIED'
WHEN v.process_flag IS NULL AND ld.process_flag IS NOT NULL
THEN
        'LEGAL VERIFIED'
ELSE
        'PROCUREMENT & LEGAL VERIFIED'
END
"verified_all",
v.validation_date "dateverified",
v.suppliername
"suppliername",
v.vendortype
"suppliertype",
v.inputby
"inputby",
TO_CHAR (v.inputdate, 'dd-mm-yyyy')
"inputdate",
v.updateby
"updateby",
TO_CHAR (v.updatedate, 'dd-mm-yyyy hh24:mi')
"updatedate",
v.vendortype
"vendortype",
v.kategori
"kategori",
v.phone
"phone",
v.email1
"email1",
v.email2
"email2",
v.email3
"email3",
v.website
"website",
v.address_ws
"address_ws",
v.address_gd
"address_gd",
v.contactname_dir
"contactname_dir",
v.email_dir
"email_dir",
v.phone_dir
"phone_dir",
v.contactname_opr
"contactname_opr",
v.contacttitle_opr
"contacttitle_opr",
v.email_opr
"email_opr",
v.phone_opr
"phone_opr",
v.topcode
"topcode",
v.info
"info",
v.referensi
"referensi",
address_sppkp
"address_sppkp",
subkategori
"subkategori",
info_desc
"info_desc",
referensi_desc
"referensi_desc",
v.datecreated
"datecreated",
ld.vendorcode
"vendorcode",
ld.akta_no
"akta_no",
ld.akta_tahun
"akta_tahun",
ld.akta_direktur
"akta_direktur",
ld.akta_upd_no
"akta_upd_no",
ld.akta_upd_tahun
"akta_upd_tahun",
ld.akta_upd_direktur
"akta_upd_direktur",
ld.nib
"nib",
ld.sppkp
"sppkp",
ld.npwp
"npwp",
ld.ktp_dir
"ktp_dir",
ld.siujk_no
"siujk_no",
ld.siujk_masa
"siujk_masa",
ld.kuasa_ktp
"kuasa_ktp",
ld.jawab_ktp
"jawab_ktp",
akta_file
"akta_file",
akta_upd_file
"akta_upd_file",
nib_file
"nib_file",
sppkp_file
"sppkp_file",
npwp_file
"npwp_file",
ktp_dir_file
"ktp_dir_file",
siujk_file
"sijk_file",
kuasa_file
"kuasa_file",
jawab_file
"jawab_file",
kuasa_ktp_file
"kuasa_ktp_file",
jawab_ktp_file
"jawab_ktp_file"
FROM epms_web.vendor v
LEFT JOIN epms_web.vendor_legal_detail ld
ON ld.VENDORCODE = v.suppliercode
WHERE v.suppliercode = :suppliercode
ORDER BY case when v.updatedate  is null then 0 else 1 end desc,v.updatedate DESC `

const fetchData = async function (users, find, callback) {
    let result

    binds = {}
    binds.find = find

    try {
        result = await database.fetchTemporaryData(users, queryStatement, binds)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}


const fetchDataDynamic = async function (users, find,callback) {
    let result, error

    binds ={}
    binds.suppliercode =(!find.suppliercode ? '' : find.suppliercode)
    try {
        result = await database.fetchTemporaryData(users, queryStatement, binds)

    } catch (errors) {
        console.log('error fetch', errors.message)
        error = errors.message
        //callback(error, '')
    }


    callback(error, result)
}


module.exports = {
    fetchDataDynamic
    , fetchData
}
