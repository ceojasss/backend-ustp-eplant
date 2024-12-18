const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = ` select rowid "rowid", documentno "documentno",to_char(tdate, 'dd-mm-yyyy') "tdate", requester "requester", currency "currency", reference "reference",
to_char(tdate, 'dd-mm-yyyy') "duedate", totalamount "totalamount", paymentto "paymentto",ppncode "ppncode", ppnrate "ppnrate", pphcode "pphcode", pphrate "pphrate",
 add_charges "add_charges", add_charges_amt "add_charges_amt", doc_receipt "doc_receipt", doc_invoice "doc_invoice", doc_faktur "doc_faktur",
  doc_tandaterima "doc_tandaterima", doc_po "doc_po", doc_spb "doc_spb", doc_pk "doc_pk", doc_agreement "doc_agreement",
   to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate", inputby "inputby",
    updateby "updateby" from permintaan_anggaran`



const fetchData = async function (users, route, callback) {

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
    fetchData
}
