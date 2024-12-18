const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select x.rowid "rowid",x.ppocode "ppocode",requestcode "requestcode", to_char(x.ppodate, 'dd-mm-yyyy hh24:mi') "ppodate",suppliercode "suppliercode#code",
get_contractorname(suppliercode) "suppliercode#description",DOC_TYPE "doc_type",pickuppoint "pickuppoint",to_char(doc_receivedate,'dd-mm-yyyy') "doc_receivedate",
remarks "remarks",downpayment_info "downpayment_info",authorized "authorized",delivered "delivered",transportationcost "transportationcost",customclearancecost "customclearancecost",othercost "othercost",
    /*v_url_preview_site (
    'PPO',
    CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || x.ppocode "v_url_preview",*/direktur "direktur",noktp "noktp",garansi "garansi",lain "lain", norek "norek#code",
namabank "namabank",namabank "norek#description", namapenerima "namapenerima",
currency "currency",topcode "topcode",deliveryinstruction "deliveryinstruction",franco "franco",purchasing_site "purchasing_site",
include_transport "include_transport",agreementcode "agrementcode#code",
payment_address "payment_address",to_char(required_date, 'dd-mm-yyyy') "required_date",process_flag "process_flag",inputby "inputby",
 to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
  from PROCONTRACTAGREEMENT x
where (x.ppocode LIKE  UPPER('%' || :search ||'%') OR remarks LIKE  UPPER('%' || :search ||'%')
)
  and case when :loginid not like '%HO' and x.ppocode like '%HO%' then null  else x.ppocode end = x.ppocode 
  AND TO_CHAR (x.ppodate, 'mmyyyy') =
  decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),to_char(x.ppodate,'mmyyyy'))
  order by x.ppodate desc
`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid "rowid",
tid "tid",ppocode "ppocode",itemcode "itemcode#code", getjob_des(itemcode) "itemcode#description",quantity "quantity",amount "amount",
unitprice "unitprice",itemdescription "itemdescription",UOM "uom",ppn "ppn",
pph "pph",
polineno "polineno",inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
 from PROCONTRACTAGREEMENTDET
where ppocode = :ppocode
`


const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        // console.log(result)
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
    binds.ppocode = (!params.ppocode ? '' : params.ppocode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}


module.exports = {
    fetchDataHeader,
    fetchDataDetail,
}
