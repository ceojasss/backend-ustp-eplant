const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `

const baseQuery = `SELECT rowid "rowid", empcode "empcode#code", epms_ustp.get_empname(empcode) "empcode#description",jabatan "jabatan", to_char(startdate,'dd-mm-yyyy') "startdate", to_char(enddate,'dd-mm-yyyy') "enddate", suppliercode "suppliercode#code",GET_SUPPLIERNAME(suppliercode) "suppliercode#description",
pic "pic", jabatan_pic "jabatan_pic", alamat_nib "alamat_nib", alamat_pabrik "alamat_pabrik", alamat_gudang "alamat_gudang",
hsl_alamat_nib"hsl_alamat_nib",hsl_alamat_pabrik"hsl_alamat_pabrik", hsl_alamat_gudang"hsl_alamat_gudang", 
foto_alamat_nib"foto_alamat_nib",foto_alamat_pabrik"foto_alamat_pabrik",foto_alamat_gudang"foto_alamat_gudang",
catatan"catatan", inputby"inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", 
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from supplier_visitation order by empcode desc`




const fetchdata = async function (users, route, callback) {

    binds = {}

    let result

    // console.log(route)

    try {
        result = await database.siteWithDefExecute(users, route, baseQuery, binds)
        //console.log(result)
    } catch (error) {
        callback(error, '')
    }

    callback('', result)
}




module.exports = {
    fetchdata
}


