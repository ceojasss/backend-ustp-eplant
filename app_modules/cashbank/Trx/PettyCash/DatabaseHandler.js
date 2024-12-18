const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `   SELECT p.ROWID
"rowid",
P.vouchercode
"vouchercode",
p.bankcode
"bankcode",
TO_CHAR (P.datecreated, 'dd-mm-yyyy')
"datecreated",
P.totalamount
"totalamount",
P.vouchertype
"vouchertype",
TO_CHAR (P.approvedate, 'dd-mm-yyyy')
"approvedate",
p.currency
"currency",
NVL (P.suppcontcode, '-')
"suppcontcode#code",
getloc_des (P.suppcontcode)
"suppcontcode#description",
P.rate
"rate",
NVL (P.paymenttobank, '-')
"paymenttobank#code",
getbankinfo (p.suppcontcode, P.paymenttobank, 'BANKNAME')
"paymenttobank#description",
p.inputby
"inputby",
TO_CHAR (p.inputdate, 'dd-mm-yyyy hh24:mi')
"inputdate",
p.updateby
"updateby",
TO_CHAR (p.updatedate, 'dd-mm-yyyy hh24:mi')
"updatedate",
CASE
WHEN p.approvedate IS NULL
THEN
           v_url_preview_site (
                   'PC',
                   CASE
                           WHEN PD.VOUCHERCODE IS NULL
                           THEN
                                   'APPROVED'
                   END)
        || P.VOUCHERCODE
ELSE
           v_url_preview_site (
                   'PC',
                   CASE
                           WHEN PD.VOUCHERCODE IS NULL
                           THEN
                                   'APPROVED'
                   END)
        || P.VOUCHERCODE
END
"v_url_preview",
CASE WHEN P.process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END
"process_flag",
CASE
WHEN NVL (P.process_flag, 'CREATED') <> 'APPROVED' THEN 'true'
ELSE 'false'
END
"approveaction",p.site "site"
/*, approveaction('','') "approveaction"*/
FROM pettycash p
LEFT JOIN pettycash PD ON P.VOUCHERCODE = PD.VOUCHERCODE,
bank     b
WHERE     p.bankcode = b.bankcode
AND CASE
    WHEN     :loginid NOT LIKE '%ADMIN'
         AND :loginid NOT LIKE '%HO'
         AND P.vouchercode LIKE '%HO%'
    THEN
            NULL
    ELSE
            P.vouchercode
END =
P.vouchercode
AND (   P.vouchercode LIKE UPPER ('%' || :search || '%')
OR P.totalamount LIKE UPPER ('%' || :search || '%'))
AND TO_CHAR (P.datecreated, 'mmyyyy') =
DECODE (
    :search,
    NULL, TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'),
                   'mmyyyy'),
    TO_CHAR (P.datecreated, 'mmyyyy'))
ORDER BY P.DATECREATED DESC`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid "rowid",
tid "tid",vouchercode "vouchercode",
locationtype "locationtype#code",
get_locationdesc (locationtype)            "locationtype#description",
locationcode "locationcode#code",
getloc_des (locationcode)                  "locationcode#description",
jobcode  "jobcode#code",
getjob_des (jobcode)     "jobcode#description",
amount "amount" ,reference "reference", remarks "remarks"
from pettycashdetail
where vouchercode= :vouchercode `



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

module.exports = {
    fetchDataHeader,
    fetchDataDetail
}


