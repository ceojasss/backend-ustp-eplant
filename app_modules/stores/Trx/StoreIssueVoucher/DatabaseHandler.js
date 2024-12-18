const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",sivcode "sivcode",storecode "storecode",to_char(sivdate, 'dd-mm-yyyy') "sivdate",status_transfer "status_transfer",
v_url_preview_site (
   'SIV',
   CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || sivcode "v_url_preview",
   v_url_preview_site (
   'SIVSL',
   CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || sivcode "v_url_preview_solar",
   v_url_preview_site (
   'SIVLX',
   CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || sivcode "v_url_preview_lx",
process_flag "process_flag",recipient "recipient",to_char(recipientdate, 'dd-mm-yyyy') "recipientdate",inputby "inputby", 
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 
    'dd-mm-yyyy hh24:mi') "updatedate" from siv
where (sivcode LIKE  UPPER('%' || :search ||'%') OR storecode LIKE  UPPER('%' || :search ||'%'))
AND TO_CHAR (sivdate, 'mmyyyy') =
decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
TO_CHAR (sivdate, 'mmyyyy')) ORDER BY sivdate DESC`


/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid",emdek "emdek",
tid "tid",sivcode "sivcode",stockcode "stockcode",locationcode "locationcode",locationtype "locationtype",kmhm "kmhm",dosis "dosis",
workorder "workorder",
quantity "quantity",price "price",amount "amount",jobcode "jobcode",remarks "remarks",
quantity_hnd "quantity_hnd",specificlocationcode "specificlocationcode",inputby "inputby", 
to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", 
to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from sivdetails
where sivcode=:sivcode`

const QueryDataLink = `SELECT MRCODE                            "mrcode",
TO_CHAR(MRDATE, 'dd-mm-yyyy')                            "mrdate",
MRNOTES                           "mrnotes",
GET_PR_REC (MRREQUESTFROM)        "req_desc",
PROCESS_FLAG                      "process_flag",
DOC_RELEASE_STATUS_F (MRCODE)     "last_flag"
FROM MR
WHERE     MRCODE IN
(SELECT DISTINCT MRCODE
FROM MRDETAILS
WHERE     NOT EXISTS
(SELECT *
FROM mrsiv o
WHERE     o.sivcode = :sivcode
AND o.itemcode = mrdetails.itemcode
AND o.mrcode = mrdetails.mrcode
AND o.locationtype =
mrdetails.locationtype
AND o.locationcode =
mrdetails.locationcode
AND o.jobcode = mrdetails.jobcode)
AND mrcode IN (SELECT mrcode
FROM mr
WHERE mrdate <= LAST_DAY (
TO_DATE ( :sivdate, 'DD-MM-YYYY'))
AND NVL (issued_qty, 0) < NVL (quantity, 0)
AND destination = :storecode)
AND NVL (process_flag, 'SUBMITED') IN
('SUBMITED', 'CREATED', 'APPROVED')) and ((mrnotes) LIKE UPPER ('%' || :search || '%') or (mrcode) LIKE UPPER ('%' || :search || '%'))
order by mrcode desc`

const QueryDataLinkDetails = `SELECT itemcode "stockcode",
itemdescription "itemdescription",
locationcode "locationcode",
to_char(expectdate,'dd-mm-yyyy') "expectdate",
quantity "quantity_request",
tid "tid",
md.mrcode"mrcode",
locationtype "locationtype",
jobcode "jobcode",
dosis "dosis",
emdek "emdek",
workorder "workorder",
process_flag "process_flag",
get_outstanding_qty_f (itemcode,
md.mrcode,
locationtype,
locationcode,
jobcode)                            "outstanding_qty",
get_stock_available_f ( :storecode, itemcode, to_date(:sivdate, 'DD-MM-YYYY'))    "quantity_hnd",
m.mrnotes||' '|| md.remarks "remarks"
FROM mrdetails md, mr m
WHERE     NOT EXISTS
(SELECT *
FROM mrsiv o
WHERE     o.sivcode = :sivcode
AND o.itemcode = md.itemcode
AND o.mrcode = md.mrcode
AND o.locationtype = md.locationtype
AND o.locationcode = md.locationcode
AND o.jobcode = md.jobcode)
AND md.mrcode IN (SELECT mrcode
FROM mr 
WHERE mrdate <= LAST_DAY ( to_date(:sivdate, 'DD-MM-YYYY')))
AND NVL (issued_qty, 0) < NVL (quantity, 0)
AND destination = :storecode
AND md.mrcode = :mrcode
and md.mrcode =m.mrcode
and process_flag='APPROVED'`



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
    binds.sivcode = (!params.sivcode ? '' : params.sivcode)

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
    binds.sivcode = (!params.sivcode ? '' : params.sivcode)
    binds.storecode = (!params.storecode ? '' : params.storecode)
    binds.sivdate = (!params.sivdate ? '' : params.sivdate)
    binds.search = (!params.search ? '' : params.search)


    let result

    try {
        result = await database.siteWithDefExecute(users, routes, QueryDataLink, binds)

    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}


const fetchDataLinkDetails = async function (users, routes, params, callback) {

    binds = {}

    /**
    * ! change the parameters according to the table
    */
    binds.mrcode = (!params.code ? '' : params.code)
    binds.sivcode = (!params.sivcode ? '' : params.sivcode)
    binds.sivdate = (!params.sivdate ? '' : params.sivdate)
    binds.storecode = (!params.storecode ? '' : params.storecode)

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
