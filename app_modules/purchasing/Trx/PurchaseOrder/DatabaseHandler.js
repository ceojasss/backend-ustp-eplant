const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select x.rowid "rowid",x.pocode "pocode",prcode "prcode", to_char(x.podate, 'dd-mm-yyyy hh24:mi') "podate",suppliercode "suppliercode#code",
get_suppliername(suppliercode) "suppliercode#description",DOC_TYPE "doc_type",pickuppoint "pickuppoint",to_char(doc_receivedate,'dd-mm-yyyy') "doc_receivedate",
remarks "remarks",authorized "authorized",delivered "delivered",transportationcost "transportationcost",customclearancecost "customclearancecost",othercost "othercost",
v_url_preview_site (
    'POSLR',
    CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || x.pocode "v_url_preview_solar",
    v_url_preview_site (
    'PO',
    CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || x.pocode "v_url_preview",
currency "currency",topcode "topcode",deliveryinstruction "deliveryinstruction",franco "franco",purchasing_site "purchasing_site",
include_transport "include_transport",agreementcode "agreementcode",
payment_address "payment_address",to_char(required_date, 'dd-mm-yyyy') "required_date",process_flag "process_flag",inputby "inputby",
 to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
  from lpo x, view_lprpo y
where x.pocode = y.pocode and (x.pocode LIKE  UPPER('%' || :search ||'%') OR remarks LIKE  UPPER('%' || :search ||'%')
OR prcode LIKE  UPPER('%' || :search ||'%'))
  and case when :loginid not like '%HO' and x.pocode like '%HO%' then null  else x.pocode end = x.pocode 
  AND TO_CHAR (x.podate, 'mmyyyy') =
  decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),to_char(x.podate,'mmyyyy'))
  order by x.podate desc`



/**
 * ! change query table detail
 */
const detailQuery = `select rowid "rowid",
tid "tid",prcode "prcode", pr_tid "pr_tid",pocode "pocode",itemcode "itemcode",quantity "quantity",amount "amount",
unitprice "unitprice",itemdescription "itemdescription",UOM "uom",statusppn "statusppn",
otheritemdesc "otheritemdesc",pph "pph",vatcapin "vatcapin",
polineno "polineno",inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
 from lpodetails
where pocode = :pocode`


const QueryDataLink = `SELECT prcode "prcode",TO_CHAR (prdate, 'dd-mm-yyyy') "prdate",prrequestfrom "prrequestfrom",prnotes "prnotes",process_flag "process_flag"
FROM (  SELECT prcode, prdate, prrequestfrom, prnotes,process_flag
     FROM lpr
    WHERE PRCODE IN
                  (SELECT DISTINCT PRCODE
                     FROM LPRDETAILS
                    WHERE     NVL (ORDERED_QTY, 0) < NVL (APPROVED_QUANTITY, 0)
                          AND NOT EXISTS
                                  (SELECT *
                                     FROM lprpo o
                                    WHERE     o.pocode = :pocode
                                          AND o.itemcode = lprdetails.itemcode
                                          AND o.prcode = lprdetails.prcode
                                          AND o.locationtype = lprdetails.locationtype
                                          AND o.locationcode = lprdetails.locationcode
                                          AND o.jobcode = lprdetails.jobcode)
                          AND prcode IN
                                  (SELECT prcode
                                     FROM lpr
                                    WHERE     prdate <=
                                              TO_DATE ( :podate,
                                                       'dd-mm-yyyy')
                                          AND process_flag = 'APPROVED')
                          AND purchasing_site = :purchasing_site)
          AND (   prcode LIKE UPPER ('%' || :search || '%')
               OR UPPER (prrequestfrom) LIKE UPPER ('%' || :search || '%')
               OR UPPER (prnotes) LIKE UPPER ('%' || :search || '%'))
 ORDER BY prdate DESC)
WHERE ROWNUM < 10`

const QueryDataLinkNonsite = `SELECT prcode "prcode",TO_CHAR (prdate, 'dd-mm-yyyy') "prdate",prrequestfrom "prrequestfrom",prnotes "prnotes",process_flag "process_flag"
FROM (  SELECT prcode, prdate, prrequestfrom, prnotes,process_flag
     FROM lpr
    WHERE PRCODE IN
                  (SELECT DISTINCT PRCODE
                     FROM LPRDETAILS
                    WHERE     NVL (ORDERED_QTY, 0) < NVL (APPROVED_QUANTITY, 0)
                          AND NOT EXISTS
                                  (SELECT *
                                     FROM lprpo o
                                    WHERE     o.pocode = :pocode
                                          AND o.itemcode = lprdetails.itemcode
                                          AND o.prcode = lprdetails.prcode
                                          AND o.locationtype = lprdetails.locationtype
                                          AND o.locationcode = lprdetails.locationcode
                                          AND o.jobcode = lprdetails.jobcode)
                          AND prcode IN
                                  (SELECT prcode
                                     FROM lpr
                                    WHERE     prdate <=
                                              TO_DATE ( :podate,
                                                       'dd-mm-yyyy')
                                          AND process_flag = 'APPROVED')
                          )
          AND (   prcode LIKE UPPER ('%' || :search || '%')
               OR UPPER (prrequestfrom) LIKE UPPER ('%' || :search || '%')
               OR UPPER (prnotes) LIKE UPPER ('%' || :search || '%'))
 ORDER BY prdate DESC)
WHERE ROWNUM < 10`


const QueryDataLinkDetails = `SELECT 
prcode "prcode",
itemcode || ' - ' || itemdescription "item",
itemcode /*|| ' - ' || itemdescription */ "itemcode",
itemdescription "itemdescription",
TO_CHAR (expectdate, 'dd-mm-yyyy') "expectdate",
get_maxitemprice_f(itemcode) "unitprice",
nvl(approved_quantity,0) - NVL (ordered_qty, 0) "quantity_table",
uomcode "uom",
tid "pr_tid",
tid "tid"
FROM LPRdetails
WHERE prcode = :prcode
ORDER BY case when nvl(approved_quantity,0) - NVL (ordered_qty, 0) = 0 then 99 else 1 end ,itemcode`

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
    binds.pocode = (!params.pocode ? '' : params.pocode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)



    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

const fetchDataLinkHeader = async function (users, routes, params, callback) {

    binds = {}


    /**
     * ! change the parameters according to the table
     */
    binds.pocode = (!params.pocode ? '' : params.pocode)
    binds.podate = (!params.podate ? '' : params.podate)
    binds.search = (!params.search ? '' : params.search)
    binds.purchasing_site = users.loginid.match(/^.*HO$/) ? 'HO': 'SO'
    let result
    // if (users.loginid.match(/^.*HO$/)) {
    //     let binds2 = _.omit(binds, ['purchasing_site'])
    //     try {
    //         result = await database.siteWithDefExecute(users, routes, QueryDataLinkNonsite, binds2)

    //     } catch (error) {
    //         callback(error, '')
    //     }
    // } else {
       
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
    binds.prcode = (!params.code ? '' : params.code)

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
    fetchDataLinkDetails,
    fetchDataLinkHeader
}