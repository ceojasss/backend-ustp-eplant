const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */

// const baseQuery =`select cr.rowid "rowid" ,REQUESTCODE "requestcode", ESTATECODE "estatecode#code",o.departmentname "estatecode#description", cr.DIVISIONCODE "divisioncode#code", o.divisionname "divisioncode#description",
// to_char(STARTDATE, 'dd-mm-yyyy') "startdate", to_char(ENDDATE, 'dd-mm-yyyy') "enddate", to_char(REQUESTDATE, 'dd-mm-yyyy') "requestdate", AUTHORIZED "authorized",
// v_url_preview_site (
//     'CR',
//     CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || REQUESTCODE "v_url_preview",
// to_char(AUTHORIZEDATE, 'dd-mm-yyyy') "authorizedate", REMARKS "remarks", PROCESS_FLAG "process_flag",to_char(AANWIJZINGDATE, 'dd-mm-yyyy') "aanwijzingdate", inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  from contractrequest cr, organization o 
//  where 
//  --requestcode between trunc(TO_DATE(:dtdate, 'dd/MM/YYYY')) and last_day(TO_DATE(:dtdate, 'dd/MM/YYYY')) and 
//  cr.estatecode=o.departmentcode and cr.divisioncode=o.divisioncode and
//  (REQUESTCODE LIKE  UPPER('%' || :search ||'%') OR estatecode LIKE  UPPER('%' || :search ||'%') OR cr.divisioncode LIKE  UPPER('%' || :search ||'%'))
//  and to_char(startdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(startdate,'mmyyyy'))`

const baseQuery = `SELECT ROWID                                             "rowid",
requestcode                                       "requestcode",
crtype                                            "crtype",
workingtype                                       "workingtype",
requestercode                                     "requestercode",
budgettype                                        "budgettype",
contractdescription                               "contractdescription",
TO_CHAR (contractdate, 'dd-mm-yyyy')              "contractdate",
authorized                                        "authorized",
TO_CHAR (startdate, 'dd-mm-yyyy')                 "startdate",
TO_CHAR (enddate, 'dd-mm-yyyy')                   "enddate",
TO_CHAR (aanwijzingdate, 'dd-mm-yyyy')            "aanwijzingdate",
inputby                                           "inputby",
TO_CHAR (inputdate, 'dd-mm-yyyy hh24:mi')         "inputdate",
updateby                                          "updateby",
TO_CHAR (updatedate, 'dd-mm-yyyy hh24:mi')        "updatedate",
PROCESS_FLAG                                      "process_flag",
   v_url_preview_site (
           'CRHO',
           CASE
                   WHEN process_flag IS NULL THEN 'DRAFT'
                   ELSE 'APPROVED'
           END)
|| REQUESTCODE                                    "v_url_preview"
FROM contractrequest
WHERE (   (    REQUESTCODE LIKE UPPER ('%' || :search || '%') OR inputby LIKE UPPER ('%' || :search || '%') OR contractdescription LIKE UPPER ('%' || :search || '%') 
     AND :search IS NOT NULL)
 OR (    :search IS NULL
     AND (   (    ( :loginid LIKE '%HO' OR :loginid LIKE '%ADMIN')
              AND 1 = 1)
          OR     (   :loginid NOT LIKE '%HO'
                  OR :loginid NOT LIKE '%ADMIN')
             AND REQUESTCODE NOT LIKE '%HO%')
     AND TO_CHAR (startdate, 'mmyyyy') =
         NVL (TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'), 'mmyyyy'),
              TO_CHAR (startdate, 'mmyyyy'))))`

/**
   * ! change query table detail
   */
const detailQuery = ` select cr.rowid "rowid" ,
tid "tid",
requestcode "requestcode", 
lineno "lineno", 
request_rate "request_rate",
req_type "req_type",
locationtype "locationtype#code",
NVL (get_locationdesc (locationtype), 'NA') "locationtype#description",
locationcode "locationcode#code",
NVL (getloc_des (locationcode), 'NA') "locationcode#description",
jobcode "jobcode#code",
getjob_des(jobcode) "jobcode#description",
uomcode "uomcode#code",  
UNITOFMEASUREdesc "uomcode#description",  
REQUEST_VOL "request_vol", 
volume "volume",
REMARKS "remarks",
budgetcurrency"budgetcurrency",
inputby "inputby",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", 
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
STATUS_FLAG "status_flag" 
from contractrequestdetail cr,UNITOFMEASURE uo 
where  UNITOFMEASURECODE = uomcode 
and requestcode= :requestcode
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
    binds.requestcode = (!params.requestcode ? '' : params.requestcode)

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
    fetchDataDetail
}
