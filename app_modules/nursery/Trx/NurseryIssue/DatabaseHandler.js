const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select sn.rowid "rowid", sivcode "sivcode", to_char(sivdate,'dd-mm-yyyy')
"sivdate",
v_url_preview_site (
'NI',
CASE WHEN sn.process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) ||
sivcode
"v_url_preview", sn.process_flag "process_flag",
sn.mrcode "mrcode", sn.inputby "inputby", to_char(sn.inputdate,
'dd-mm-yyyy hh24:mi') "inputdate",
sn.updateby "updateby", to_char(sn.updatedate,'dd-mm-yyyy hh24:mi')
"updatedate",MRNURSERYCODE "nurserycodedisplayonly",  sum(quantity) 
"qtyrequestdisplayonly"
from siv_nursery sn, MR_nursery mn, mrdetails_nursery md
where
sn.mrcode = md.mrcode and
sn.mrcode =mn.mrcode and (sivcode LIKE  UPPER('%' || :search ||'%') OR
sivdate LIKE  UPPER('%' || :search ||'%'))
and to_char(sivdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY')
,'mmyyyy'),to_char(sivdate,'mmyyyy')) 
group by sn.rowid, sivcode, to_char(sivdate,'dd-mm-yyyy')
,
--v_url_preview_site (    'NI',CASE WHEN sn.process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) ||sivcode"v_url_preview", 
sn.process_flag ,sivdate,
sn.mrcode , sn.inputby , to_char(sn.inputdate,
'dd-mm-yyyy hh24:mi') ,
sn.updateby , to_char(sn.updatedate,'dd-mm-yyyy hh24:mi')
,MRNURSERYCODE
order by sivdate desc
`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid "rowid", 
tid "tid",sivcode "sivcode", plotcode "plotcode#code", locationcode "locationcode",
locationtype "locationtype#code", quantity "quantity",
jobcode||' - '||getjob_des(jobcode) "jobcode", remarks "remarks",
inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from sivdetails_nursery
where sivcode= :sivcode
`

// const requestData = `SELECT 
// locationcode "locationcode",
// to_char(expectdate,'dd-mm-yyyy') "expectdate",
// quantity "quantity",
// md.mrcode"mrcode",
// locationtype "locationtype",
// jobcode "jobcode",
// process_flag "process_flag"
// FROM mrdetails_nursery md, mr_nursery m
// WHERE     NOT EXISTS
// (SELECT *
// FROM siv_nursery o
// WHERE  o.mrcode = md.mrcode)
// AND md.mrcode = :mrcode
// and md.mrcode =m.mrcode`

// const QueryDataLinkDetails = `SELECT 
// locationcode "locationcode",
// to_char(expectdate,'dd-mm-yyyy') "expectdate",
// quantity "quantity_request",
// tid "tid",
// md.mrcode"mrcode",
// locationtype "locationtype",
// jobcode "jobcode",
// process_flag "process_flag"
// FROM mrdetails_nursery md, mr_nursery m
// WHERE     NOT EXISTS
// (SELECT *
// FROM siv_nursery o
// WHERE      o.mrcode = md.mrcode)
// AND md.mrcode IN (SELECT mrcode
// FROM mr_nursery 
// WHERE mrdate <= LAST_DAY ( to_date(:sivdate, 'DD-MM-YYYY')))
// AND md.mrcode = :mrcode
// and md.mrcode =m.mrcode
// `


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


// const fetchDataLinkDetails = async function (users, routes, params, callback) {

//     binds = {}

//     /**
//     * ! change the parameters according to the table
//     */
//     binds.mrcode = (!params.mrcode ? '' : params.mrcode)

//     let result

//     try {
//         result = await database.siteWithDefExecute(users, routes, requestData, binds)

//     } catch (error) {
//         callback(error, '')
//     }



//     callback('', result)
// }

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    // fetchDataLinkDetails

}


