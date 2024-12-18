const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const queryStatement = `SELECT g.podate,
a.receivenotecode "nomorbpb",
to_char (a.rndate,'dd-mm-yyyy') "tanggal",
a.suppliercode "supplier",
get_suppliername(a.suppliercode)"supplierdesc",
a.deliveryordercode "suratjalan",
a.pocode "po",
g.franco "lokasi",
purchaseitemcode "DETAIL#purchaseitemcode",
b.itemdescription  ||' '||  f.otheritemdesc        "DETAIL#itemdescription",
b.quantity"DETAIL#quantity",
d.unitofmeasuredesc "DETAIL#unitofmeasuredesc",
g.remarks"remarkspo",
e.prcode"pr",
   b.LOCATIONTYPE
 ||' - '||
 b.LOCATIONCODE
 ||' - '||
 b.jobcode
 ||get_itemmap (purchaseitemcode)                  "DETAIL#loc",
NVL ((SELECT storecode  ||' - '||  storename
        FROM storeinfo
       WHERE storecode = b.locationcode),
     'Direct Charges')                             AS gudang,
CASE
        WHEN purchaseitemcode IN
                     (SELECT itemcode FROM purchaseitem_karung)
        THEN
                TO_CHAR (NVL (karung, 0)) ||  ' Krg '
        ELSE
                a.remarks
END keterangan,
a.remarks "remarksgrn"
FROM receivenote        a,       receivenotedetail  b,       purchaseitem       c,
unitofmeasure      d,       lprpodetails       e,       lpodetails         f,       lpo                g
WHERE     a.receivenotecode = b.receivenotecode
AND b.purchaseitemcode = c.itemcode
AND f.uom = d.unitofmeasurecode(+)
AND a.receivenotecode = e.receivenotecode
AND b.purchaseitemcode = e.itemcode
AND a.receivenotecode ='GCM/GRN/2104/00802'
AND e.pocode = f.pocode
AND f.pocode = g.pocode
AND e.itemcode = f.itemcode `

const fetchData = async function (users, find, callback) {
    let result

    binds = {}
    binds.find = find
    console.log("users",users);
    try {
        result = await database.fetchTemporaryData(users, queryStatement, binds)
    } catch (error) {
        callback(error, '')
    }
    callback('', result)
}


const fetchDataDynamic = async function (users, find, callback) {
    let result, error

    //    console.log(find)

    // console.log('site D', '<' + users.site + '>')
    /* 
        binds = {}
        binds.find = find
     */
    try {
        result = await database.fetchTemporaryData(users, queryStatement, find)

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
