const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `Select 
mn.rowid "rowid",
mn.mrcode"mrcode",
to_char (mn.mrdate,'dd-mm-yyyy')"mrdate",
mn.mrnurserycode"mrnurserycode#code",
n.description"mrnurserycode#description",
mn.mrrequestfrom"mrrequestfrom",
mn.mrnotes"mrnotes",
mn.PROCESS_FLAG "process_flag",
v_url_preview_site (
    'NR',
    CASE WHEN mn.process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || MN.MRCODE "v_url_preview",
mn.inputby "inputby", 
to_char(mn.inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
mn.updateby "updateby", 
to_char(mn.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from mr_nursery mn ,nursery n
where mrcode  =mrcode and n.NURSERYCODE = mn.mrnurserycode and 
(mn.mrcode LIKE  UPPER('%' || :search ||'%'))
and to_char(mn.mrdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(mrdate,'mmyyyy')) ORDER BY mn.mrdate DESC`

/**
   * ! change query table detail
   */
const detailQuery = `select 
rowid "rowid" ,
tid "tid",
mrcode"mrcode",
locationtype "locationtype#code",
locationtype "locationtype#description", 
locationcode "locationcode#code",
getloc_des(locationcode)"locationcode#description",
jobcode "jobcode#code",
getjob_des(jobcode) "jobcode#description",
to_char(expectdate,'dd-mm-yyyy')  "expectdate", 
remarks "remarks",
quantity "quantity", 
inputby "inputby", 
to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
updateby "updateby", 
to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from mrdetails_nursery where mrcode=:mrcode
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
    binds.mrcode = (!params.mrcode ? '' : params.mrcode)

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


