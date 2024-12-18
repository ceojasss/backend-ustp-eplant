const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

// const baseQuery = ` select CONTROLJOB "controljob", GROUPCODE "groupcode",
// GROUPDESCRIPTION "groupdescription", LEVELCODE "levelcode", PARENTCODE "parentcode"
// from stockgroup `

const baseQuery = `select ROWID "rowid",  SUPPLIERCODE "suppliercode", SUPPLIERNAME "suppliername", 
NVL(CONTROLJOB,'')  "controljob#code",NVL(getjob_des(CONTROLJOB),'') "controljob#description", 
NPWP "npwp" , 
NPKP "npkp", katakunci "katakunci",
to_char(DATECREATED,'dd-mm-yyyy') "datecreated",
address "address",
email3 "email1",
email3 "email2",
email3 "email3",
'HO' "typedisplayonly",
INACTIVE "inactive",
CONTACTNAME "contactname",
CONTACTTITLE "contacttitle",
city "city",
postalcode "postalcode",
state "state",
country "country",
phone "phone",
fax "fax",
email "email",
remarks "remarks",
bankname "bankname",
bankaccno "bankaccno",
to_char(LASTTRANSACTION,'dd-mm-yyyy') "lasttransaction",
PAYMENTTERMS "paymentterms",
TOTALRETENTIONAMT "totalretentionamt",
TOTALBONDS "totalbonds",
BUMIPUTERA "bumiputera",
NATIONALITY "nationality",
SUPPLIERTYPE "suppliertype",
NOSERIFAKTURPAJAK "noserifakturpajak",
NPWP_ADDRESS "npwp_address",
CONTACTNAME_DIR "contactname_dir",
CONTACTNAME_OPR "contactname_opr",
topcode "topcode",
direktur "direktur", kategori "kategori",
telp "telp", referensi"referensi",
to_char(inactivedate,'dd-mm-yyyy') "inactivedate",
inputby "inputby",
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby",
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
from supplier order by suppliercode`




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


