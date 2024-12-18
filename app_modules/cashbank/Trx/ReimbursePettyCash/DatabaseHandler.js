const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `  SELECT p.ROWID "rowid",
P.vouchercode "vouchercode",
p.bankcode "bankcode",
TO_CHAR (P.datecreated, 'dd-mm-yyyy') "datecreated",
P.totalamount "totalamount",
P.vouchertype "vouchertype",
TO_CHAR (P.approvedate, 'dd-mm-yyyy') "approvedate",
p.currency "currency",
NVL (P.suppcontcode, '-') "suppcontcode#code",
getloc_des (P.suppcontcode) "suppcontcode#description",
P.rate "rate",
NVL (P.paymenttobank, '-') "paymenttobank#code",
getbankinfo (p.suppcontcode, P.paymenttobank, 'BANKNAME') "paymenttobank#description",
p.inputby "inputby",
TO_CHAR (p.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate",
p.updateby "updateby",
TO_CHAR (p.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate",
CASE
        WHEN p.approvedate IS NULL
        THEN
                   v_url_preview_site ( 'PV',decode(nvl(PD.VOUCHERCODE ,'X') ,'X', 'DRAFT','APPROVED'))
        ELSE
                   v_url_preview_site ( 'PVA', decode(nvl(PD.VOUCHERCODE ,'X') ,'X', 'DRAFT','APPROVED')) 
END || P.VOUCHERCODE "v_url_preview",
decode(nvl(PD.VOUCHERCODE ,'X') ,'X', 'DRAFT','APPROVED') "process_flag",
decode(nvl(PD.VOUCHERCODE ,'X') ,'X', 'true','false') "approveaction"
FROM paymentvoucher_DRAFT p
LEFT JOIN paymentvoucher PD ON P.VOUCHERCODE = PD.VOUCHERCODE,
bank                b
WHERE     p.bankcode = b.bankcode
AND CASE
            WHEN :loginid NOT LIKE '%ADMIN' AND :loginid NOT LIKE '%HO' AND P.vouchercode LIKE '%HO%'
            THEN
                    NULL
            ELSE
                    P.vouchercode
    END = P.vouchercode
AND (   P.vouchercode LIKE UPPER ('%' || :search || '%') OR P.totalamount LIKE UPPER ('%' || :search || '%'))
AND TO_CHAR (P.datecreated, 'mmyyyy') =DECODE (:search,NULL, TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'),'mmyyyy'),TO_CHAR (P.datecreated, 'mmyyyy'))
and exists ( select '1' from epms_ustp.pettycash pc , paymentvoucherdetail_draft d where pc.vouchercode = d.payment_reference and d.vouchercode = p.vouchercode ) 
ORDER BY P.DATECREATED DESC `

/**
   * ! change query table detail
   */
const detailQuery = `SELECT a.ROWID                             "rowid",
a.tid                             "tid",
a.vouchercode                       "vouchercode",
a.locationtype                      "locationtype",
a.locationcode                      "locationcode",
getloc_des (a.locationcode)         "description#displayonly",
a.jobcode                           "jobcode",
getjob_des (a.jobcode)              "jobdescription#displayonly",
a.amount                            "amount",
a.reference                         "reference",
a.remarks                           "remarks",
a.cashflowcode                      "cashflowcode",
v.parametervalue                    "cashflowdescription",
volume                            "volume",
vouchercode                       "payment_reference"
FROM paymentvoucherdetail_draft a
LEFT JOIN parametervalue v
        ON     parametercode = 'EPMS104'
           AND cashflowcode = v.parametervaluecode
WHERE vouchercode = :vouchercode
ORDER BY a.tid `

const QueryDataLink = `  SELECT vouchercode "vouchercode",
TO_CHAR (approvedate, 'dd-mm-yyyy') "approvedate",
suppcontcode || ' - ' || getloc_des (suppcontcode) "remarks",
totalamount "totalamount"
FROM epms_ustp.pettycash h, parameter p
WHERE     H.site = parametername
AND p.parametercode = 'COMP_CODE'
AND h.vouchercode LIKE UPPER ('%' || :search || '%')
and h.process_flag = 'APPROVED'
AND not EXISTS
            (SELECT '1'
               FROM paymentvoucherdetaiL_draft
              WHERE h.vouchercode = payment_reference)
ORDER BY h.vouchercode DESC`

const QueryDataLinkDetails = `SELECT
a.tid                                   "tid",
vouchercode                             "vouchercode",
locationtype                            "locationtype",
locationcode                            "locationcode",
getloc_des (locationcode)               "description#displayonly",
jobcode                                 "jobcode",
getjob_des (jobcode)                    "jobdescription#displayonly",
amount                                  "amount",
reference                               "reference",
remarks                                 "remarks",
cashflowcode                            "cashflowcode",
parametervalue                          "cashflowdescription",
volume                                  "volume",
vouchercode                       "payment_reference"
FROM EPMS_USTP.pettycashdetail  a
LEFT JOIN parametervalue
        ON     parametercode = 'EPMS104'
           AND cashflowcode = parametervaluecode
WHERE vouchercode = :vouchercode
order by a.tid`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)

        //        console.log(result)
    } catch (error) {
        callback(error, '')
    }

    if (_.isEmpty(result)) {
        callback('', '')
    } else {
        callback('', result)
    }


}
const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */
    binds.vouchercode = (!params.vouchercode ? '' : params.vouchercode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)

    } catch (error) {
        callback(error, '')
    }




    if (_.isEmpty(result)) {
        callback('', '')
    } else {
        callback('', result)
    }
}

const fetchDataLinkHeader = async function (users, routes, params, callback) {

    binds = {}


    /**
     * ! change the parameters according to the table
     */
    // binds.vouchercode = (!params.vouchercode ? '' : params.vouchercode)
    // binds.approvedate = (!params.approvedate ? '' : params.approvedate)
    binds.search = (!params.search ? '' : params.search)

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
    binds.vouchercode = (!params.code ? '' : params.code)

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


