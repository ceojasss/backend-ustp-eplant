const _ = require("lodash");
const oracledb = require("oracledb");
const database = require("../../../../oradb/dbHandler");

/**
 * ! change query table header
 */
const baseQuery = `
select a.rowid "rowid", a.invoicecode "invoicecode",to_char(a.invoicedate, 'dd-mm-yyyy') "invoicedate",
a.suppliercode||'  '||get_suppliername(a.suppliercode) "suppliercode",
a.faktur"faktur",
b.lpocode"lpocode",
a.faktur_pajak"faktur_pajak",
a.remarks "remarks", 
a.invoice_amount "invoice_amount",
a.dp_amount"dp_amount",
a.inputby "inputby", to_char(a.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
a.updateby "updateby", to_char(a.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"  
from invoice a, invoicelpo b
where a.invoicecode=b.invoicecode and 
(a.invoicecode LIKE  UPPER('%' || :search ||'%') OR a.remarks LIKE  UPPER('%' || :search ||'%'))
and to_char(invoicedate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),
to_char(invoicedate,'mmyyyy')) ORDER BY invoicedate DESC`

/**
 * ! change query table detail
 */
const detailQuery = `select b.tid"tid",b.rowid"rowid",
c.invoicecode "invoicecode",
a.receivenotecode "receivenotecode",
to_char(a.rndate, 'dd-mm-yyyy') "rndate", 
b.amountreceived"amountreceived",
b.amountreturn"amountreturn",
b.othercost"othercost",
b.purchaseitemcode"purchaseitemcode",
b.itemdescription"itemdescription",
b.quantity"quantity",
b.amountreceived"rec_amount",
b.qtyreturn"ret_qty",
b.amountreturn"ret_amount",
a.inputby "inputby", to_char(a.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
a.updateby "updateby", to_char(a.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"  
from invoice c , receivenote a , receivenotedetail b 
where  c.invoicecode=:invoicecode
and a.invoicecode=c.invoicecode
and  a.RECEIVENOTECODE=b.RECEIVENOTECODE  `;



const QueryDataLink = `select receivenotecode "receivenotecode",to_char(rndate,'dd-mm-yyyy') "rndate",deliveryordercode "deliveryordercode", remarks "remarks" 
from receivenote where pocode=:pocode and invoicecode is null
`

const QueryDataLinkDetails = `select b.tid"tid",b.rowid"rowid",
b.amountreceived"amountreceived",
b.amountreturn"amountreturn",
b.othercost"othercost",
b.purchaseitemcode"purchaseitemcode",
b.itemdescription"itemdescription",
b.quantity"quantity",
b.amountreceived"rec_amount",
b.qtyreturn"ret_qty",
b.amountreturn"ret_amount"
from receivenotedetail b
where receivenotecode=:receivenotecode order by purchaseitemcode `

const fetchDataHeader = async function (users, params, routes, callback) {
    binds = {};

    binds.limitsize = !params.size ? 0 : params.size;
    binds.page = !params.page ? 1 : params.page;
    binds.search = !params.search ? "" : params.search;
    binds.dateperiode = !params.dateperiode ? "" : params.dateperiode;

    let result;

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds);

        // console.log(result)
    } catch (error) {
        callback(error, "");
    }

    callback("", result);
};
const fetchDataDetail = async function (users, routes, params, callback) {
    binds = {};

    /**
     * ! change the parameters according to the table
     */
    binds.invoicecode = !params.invoicecode ? "" : params.invoicecode;
    let result;

    try {
        result = await database.siteWithDefExecute(
            users,
            routes,
            detailQuery,
            binds
        );
    } catch (error) {
        console.log('error', error)
        callback(error, "");
    }

    callback("", result);
};
const fetchDataLinkHeader = async function (users, routes, params, callback) {

    binds = {}


    /**
     * ! change the parameters according to the table
     */
    // binds.vouchercode = (!params.vouchercode ? '' : params.vouchercode)
    // binds.approvedate = (!params.approvedate ? '' : params.approvedate)
    binds.pocode = (!params.pocode ? '' : params.pocode)

    let result


    try {
        result = await database.siteWithDefExecute(users, routes, QueryDataLink, binds)

    } catch (error) {
        callback(error, '')
    }
    // }



    callback('', result)
}

const fetchDataLinkDetails = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */



    binds.receivenotecode = (!params.receivenotecode ? '' : params.receivenotecode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, QueryDataLinkDetails, binds)

    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    fetchDataLinkHeader,
    fetchDataLinkDetails
}
