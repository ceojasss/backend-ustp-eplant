const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select "rowid", "requestcode", NVL(cr.ESTATECODE,'') "estatecode#code",NVL(o.departmentname,'') "estatecode#description",NVL(cr.DIVISIONCODE,'') "divisioncode#code", NVL(o.divisionname,'') "divisioncode#description",
"startdate", "enddate","requestdate","authorized","spk_type","v_url_preview","authorizedate","remarks","process_flag","aanwijzingdate", "inputby","inputdate", "updateby","updatedate"  from (select rowid "rowid" ,REQUESTCODE "requestcode", ESTATECODE , DIVISIONCODE,
to_char(STARTDATE, 'dd-mm-yyyy') "startdate", to_char(ENDDATE, 'dd-mm-yyyy') "enddate", to_char(REQUESTDATE, 'dd-mm-yyyy') "requestdate", AUTHORIZED "authorized",spk_type "spk_type",
v_url_preview_site (
    'CR',
    CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || REQUESTCODE
 "v_url_preview",
to_char(AUTHORIZEDATE, 'dd-mm-yyyy') "authorizedate", REMARKS "remarks", PROCESS_FLAG "process_flag",to_char(AANWIJZINGDATE, 'dd-mm-yyyy') "aanwijzingdate", inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  from contractrequest 
 where 
 --requestcode between trunc(TO_DATE(:dtdate, 'dd/MM/YYYY')) and last_day(TO_DATE(:dtdate, 'dd/MM/YYYY')) and 
 (REQUESTCODE LIKE  UPPER('%' || :search ||'%') OR estatecode LIKE  UPPER('%' || :search ||'%') OR divisioncode LIKE  UPPER('%' || :search ||'%') OR inputby LIKE  UPPER('%' || :search ||'%'))
 and case when :loginid not like '%HO' and REQUESTCODE like '%HO%' then null  else REQUESTCODE end = REQUESTCODE
 AND TO_CHAR (requestdate, 'mmyyyy') =
 decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
 TO_CHAR (requestdate, 'mmyyyy'))) cr left join  organization o on cr.estatecode=o.departmentcode and cr.divisioncode=O.DIVISIONCODE order by "requestcode" desc
`

/**
   * ! change query table detail
   */
const detailQuery = `select "rowid","tid","requestcode","lineno","locationtype#code","locationtype#description","locationcode#code","locationcode#description","jobcode#code","jobcode#description",
xx.uomcode "uomcode#code",x.UNITOFMEASUREDESC "uomcode#description","request_vol","volume","request_rate","remarks","inputby","inputdate","updateby","updatedate","status_flag","hadisplayonly" from (select rowid "rowid" ,
tid "tid",
requestcode "requestcode", 
lineno "lineno", 
locationtype "locationtype#code",
NVL (get_locationdesc (locationtype), 'NA') "locationtype#description",
locationcode "locationcode#code",
NVL (getloc_des (locationcode), 'NA') "locationcode#description",
jobcode "jobcode#code",
getjob_des(jobcode) "jobcode#description",
uomcode ,
REQUEST_VOL "request_vol",
volume "volume",
REMARKS "remarks",
request_rate "request_rate",
inputby "inputby",
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", 
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" ,
STATUS_FLAG "status_flag",
case when locationcode = 'OP' and uomcode ='HA' then
check_ha_cr ( locationcode,uomcode , REQUEST_VOL, jobcode) 
else to_char(0) end "hadisplayonly"
from contractrequestdetail where requestcode= :requestcode)xx  left join unitofmeasure x on UNITOFMEASURECODE = xx.uomcode  
order by "lineno"`


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

const CheckHA = async function (users, routes, params, callback) {

        binds = {}
// console.log(params)
// 'L05805','HA',12
        /**
       * ! change the parameters according to the table
       */
        binds.fieldcode = (!params.fieldcode ? '' : params.fieldcode)
        binds.uom = (!params.uom ? '' : params.uom)
        binds.qty = (!params.qty ? '' : params.qty)
        binds.jobcode = (!params.jobcode ? '' : params.jobcode)


        let result

        // console.log(users.loginid)

        //    (users, statement, binds, opts = {})
        try {
// console.log(binds)
            // const stmt = `select check_ha_cr ('L05805','HA',12) "ha" from dual`
            const stmt = `select check_ha_cr ( :fieldcode, :uom, :qty, :jobcode) "ha" from dual`

            result = await database.siteWithDefExecute(users, routes, stmt, binds)
            

        } catch (error) {
            callback(error)
        }

        callback('', result)
}

const HectPlanted = async function (users, routes, params, callback) {

    binds = {}
// console.log(params)
// 'L05805','HA',12
    /**
   * ! change the parameters according to the table
   */
    binds.fieldcode = (!params.fieldcode ? '' : params.fieldcode)


    let result

    // console.log(users.loginid)

    //    (users, statement, binds, opts = {})
    try {
// console.log(binds)
        // const stmt = `select check_ha_cr ('L05805','HA',12) "ha" from dual`
        const stmt = `select hectplanted "hectplanted" from fieldcrop where fieldcode = :fieldcode`

        result = await database.siteWithDefExecute(users, routes, stmt, binds)
        

    } catch (error) {
        callback(error)
    }

    callback('', result)
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    CheckHA,
    HectPlanted
}
