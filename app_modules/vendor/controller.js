const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../oradb/dbHandler')
const { updatedataHandler } = require('../../util/HelperUtility')


const baseQuery = `SELECT 
VENDORCODE "Vendor Code",
VENDORNAME "Vendor Name",
VENDORTYPE "Vendor Type",
ADDRESS "Alamat",
CITY "Kota",
POSTALCODE "Kode Pos",
STATE "Provinsi",
COUNTRY "Negara",
EMAIL "email",
REMARKS "remarks"
FROM (SELECT SUPPLIERCODE         VENDORCODE,
        SUPPLIERNAME         VENDORNAME,
        'SUPPPLIER'          VENDORTYPE,
        ADDRESS,
        CITY,
        POSTALCODE,
        STATE,
        COUNTRY,
        EMAIL,
        REMARKS
   FROM epmsapps.supplier
 UNION
 SELECT CONTRACTORCODE         VENDORCODE,
        CONTRACTORNAME         VENDORNAME,
        'CONTRACTOR'           VENDORTYPE,
        ADDRESS,
        CITY,
        POSTALCODE,
        STATE,
        COUNTRY,
        EMAIL,
        REMARKS
   FROM epms_gcm.CONTRACTOR)
WHERE VENDORCODE = :id`


const vendorQuery = `SELECT distinct rowid "rowids",
TO_CHAR(datecreated      ,'dd-mm-yyyy')	        "datecreated",
       vendortype               "vendortype",
       suppliercode             "suppliercode",
       kategori                 "kategori",
       subkategori "subkategori",
       suppliername             "suppliername",
       phone                    "phone",
       email1                   "email1",
       email2                   "email2",
       email3                   "email3",
       website                  "website",
       address                  "address",
       address_ws               "address_ws",
       address_gd               "address_gd",
       contactname_dir          "contactname_dir",
       email_dir                "email_dir",
       phone_dir                "phone_dir",
       contactname_opr          "contactname_opr",
       contacttitle_opr         "contacttitle_opr",
       email_opr                "email_opr",
       phone_opr                "phone_opr",
       topcode                  "topcode",
       info                     "info",
       referensi                "referensi"
  FROM VENDOR
 WHERE SUPPLIERCODE = :id`

const vendorLegalQuery = `SELECT distinct  rowid "rowids" , vendorcode	"vendorcode",
 akta_file	"akta_file",
 akta_tahun	"akta_tahun",
 akta_direktur	"akta_direktur",
 akta_upd_no	"akta_upd_no",
 akta_upd_tahun	"akta_upd_tahun",
 akta_upd_direktur	"akta_upd_direktur",
 nib	"nib",
 sppkp	"sppkp",
 npwp	"npwp",
 ktp_dir	"ktp_dir",
 siujk_no	"siujk_no",
 TO_CHAR(siujk_masa,'dd-mm-yyyy')	 	"siujk_masa",
 kuasa_ktp	"kuasa_ktp",
 jawab_ktp	"jawab_ktp",
 inputby	"inputby",
 TO_CHAR(inputdate,'dd-mm-yyyy')	"inputdate",
 updateby	"updateby",
 TO_CHAR(updatedate,'dd-mm-yyyy')	"updatedate",
 akta_no	"akta_no",
 akta_upd_file	"akta_upd_file",
 nib_file	"nib_file",
 sppkp_file	"sppkp_file",
 npwp_file	"npwp_file",
 ktp_dir_file	"ktp_dir_file",
 siujk_file	"siujk_file"
 ,kuasa_ktp_file	"kuasa_ktp_file"
 ,jawab_ktp_file	"jawab_ktp_file"
 ,kuasa_nama "kuasa_nama"
 FROM VENDOR_LEGAL_DETAIL
  WHERE VENDORCODE = :id `



async function get(req, res, next) {

    let result

    binds = {}
    binds.id = req.params.id

    users = req.user

    //    console.log(users, binds)


    try {
        result = await database.siteExecute(users, baseQuery, binds)


        res.send(
            // 
            result
            // count: (!_.isEmpty(result) ? result['data'][0]['total_rows'] : 0)
        )

    } catch (error) {
        res.send(error, { users })
        //callback(error, '')
    }
}

async function vendor(req, res, next) {


    let result, _type

    binds = {}
    binds.id = req.user.sub

    _type = req.params.type

    users = req.user

    let _query = ''

    if (_type === 'vendor') {
        _query = vendorQuery
    } else if (_type === 'vendorlegality') {
        _query = vendorLegalQuery
    }

    if (_query === '') {
        res.send({})
    } else {

        try {
            result = await database.siteExecute(users, _query, binds)
            result2 = await database.getFormComponent(req.user, _type)


            res.send({ data: result.rows, formComps: result2 })

        } catch (error) {
            res.send(error)
        }
    }
}

async function update(req, res, next) {
    binds = {}
    binds.id = req.params.id
    let tname

    users = req.user


    let process = []
    //  console.log(binds.id)


    if (binds.id === 'vendorlegality') {
        tname = 'vendor_legal_detail'
    }
    else {
        tname = 'vendor'
    }

    let retval, conn, dbConnection, stmt, params

    params = {}
    params.suppliercode = users.sub
    // * 1. PREPARE CONNECTION TO BE USED THROUGOUT THE PROCESS...
    dbConnection = database.getdbCreds(users.site)
    conn = await oracledb.getConnection(dbConnection);
    const query = `BEGIN 
    epms_ustp.auto_email_iproc_notif (:suppliercode);
    END; `
    stmt = await database.siteExecuteDynamicBinds(users, query, params)
    process.push(updatedataHandler(tname, req, res))
    process.push(stmt)
    // process.push( /** */)


    await Promise.all(process)
        .then(
            (promised) => {
                retval = promised
                conn.commit(() => { conn.close() })
            })
        .catch(error => {
            conn.rollback(() => { conn.close() });
            throw new Error(error)
        })



    // await updatedataHandler(tname, req, res)
}


module.exports = {
    get,
    vendor,
    update
}