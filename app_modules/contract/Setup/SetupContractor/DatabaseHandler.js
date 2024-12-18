const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = ` select ROWID "rowid",CONTRACTORCODE "contractorcode", CONTRACTORNAME "contractorname",
CONTACTNAME "contactname", CONTACTTITLE "contacttitle", ADDRESS "address", CITY "city", katakunci "katakunci",
POSTALCODE "postalcode", STATE "state", COUNTRY "country", PHONE "phone", FAX "fax", EMAIL "email", 
REMARKS "remarks", BANKNAME "bankname", BANKACCNO "bankaccno", 
case
when CONTRACTORCODE  like 'KH%' then 'HO'
when CONTRACTORCODE  like 'K%' then 'SO'
else null
end "companydisplayonly",
to_char(LASTTRANSACTION,'dd-mm-yyyy') "lasttransaction", PAYMENTTERMS "paymentterms", TOTALRETENTIONAMT "totalretentionamt",
TOTALBONDS "totalbonds", BUMIPUTERA "bumiputera", NATIONALITY "nationality", to_char(DATECREATED,'dd-mm-yyyy') "datecreated", 
CONTROLJOB "controljob#code", getjob_des(CONTROLJOB) "controljob#description", NPWP "npwp", INACTIVE "inactive",direktur "direktur", referensi "referensi",telp "telp",kategori "kategori",
to_char(INACTIVEDATE,'dd-mm-yyyy') "inactivedate", inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi')
"inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  from contractor order by CONTRACTORCODE`


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


