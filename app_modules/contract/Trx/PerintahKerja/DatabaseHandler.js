const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `  SELECT ROWID
"rowid",
agreementcode
"agreementcode",
description
"description",
TO_CHAR (agreementdate, 'dd-mm-yyyy')
"agreementdate",
contractorcode
"contractorcode#code",
v_url_preview_site (
   'CA',
   CASE
           WHEN process_flag IS NULL THEN 'DRAFT'
           ELSE 'APPROVED'
   END)
|| agreementcode
"v_url_preview",
contractorcode
"contractorcode#description",
TO_CHAR (startdate, 'dd-mm-yyyy')
"startdate",
TO_CHAR (enddate, 'dd-mm-yyyy')
"enddate",
currid
"currid",
rate
"rate",
closed
"closed",
topcode
"topcode",
authorizationdate
"authorizationdate",
rfflag
"rfflag",
dptype
"dptype",
authorization
"authorization",
origin_contract
"origin_contract",
requestno
"requestno",
process_flag
"process_flag",
inputby
"inputby",
TO_CHAR (inputdate, 'dd-mm-yyyy hh24:mi')
"inputdate",
updateby
"updateby",
TO_CHAR (updatedate, 'dd-mm-yyyy hh24:mi')
"updatedate"
FROM contractagreement
WHERE     (   agreementcode LIKE UPPER ('%' || :search || '%')
OR contractorcode LIKE UPPER ('%' || :search || '%')
OR description LIKE UPPER ('%' || :search || '%')
OR inputby LIKE UPPER ('%' || :search || '%')
OR requestno LIKE UPPER ('%' || :search || '%'))
AND TO_CHAR (agreementdate, 'mmyyyy') =
DECODE (
    :search,
    NULL, TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'),
                   'mmyyyy'),
    TO_CHAR (agreementdate, 'mmyyyy'))
ORDER BY agreementdate DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` select  "rowid" ,
"tid", "agreementcode", "lineno", 
"job#code", "job#description",
/*locationtype "locationtype",*/
"locationtype#code","locationtype#description",
"locationcode#code","locationcode#description",
"duedate", "qty",  "rate", "amount","uom", "description", "pphcode", 
"ppncode", "inputby","inputdate",  "updateby","updatedate" 
from (select rowid "rowid", tid "tid", agreementcode "agreementcode", lineno "lineno", 
job "job#code", NVL (getjob_des (job), 'NA') "job#description", 
locationtype "locationtype#code",NVL (get_locationdesc (locationtype), 'NA') "locationtype#description",
locationcode "locationcode#code",NVL (getloc_des (locationcode), 'NA') "locationcode#description",
to_char(duedate,'dd-mm-yyyy') "duedate", qty "qty", rate "rate",
amount "amount",uom "uom",description "description",pphcode "pphcode", 
ppncode "ppncode",inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
from agreementdetail where agreementcode= :agreementcode)`


const requestData = `SELECT requestcode "requestcode",
lineno "lineno",
tid "tid",
--locationtype "locationtype",
locationtype "locationtype#code",
get_locationdesc(locationtype) "locationtype#description",
locationcode "locationcode#code" ,
GET_LOCT_CODE_DESC_F    (locationtype,locationcode) "locationcode#description" ,
jobcode "job#code",
getjob_des(jobcode) "job#description",
remarks "description",
request_vol "qty",
request_rate "rate",
vegetationtype "vegetationtype",
topografy "topografy",
gulmatype "gulmatype",
uomcode "uom"
FROM contractrequestdetail
WHERE     lineno NOT IN (
SELECT lineno
                     FROM contractagreement x, agreementdetail y
                    WHERE x.agreementcode = y.agreementcode AND requestno = :requestno
                    )
AND requestcode = :requestno
order by lineno
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
    binds.agreementcode = (!params.agreementcode ? '' : params.agreementcode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


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



    binds.requestno = (!params.crcode ? '' : params.crcode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, requestData, binds)

    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}


module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    fetchDataLinkDetails
}

