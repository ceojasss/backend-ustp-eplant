const _ = require('lodash')
// const database = require('../../../../oradb/dbHandler')
const database = require('../../../../oradb/dbHandler')


const baseQuery = `select ROWID "rowid",WORKORDERNO "workorderno",to_char(ORDERDATE,'dd-mm-yyyy')  "orderdate", REQESTEDBYDEPT "reqestedbydept#code",
LOCATIONTYPE "locationtype#code", get_locationdesc (locationtype) "locationtype#description",
LOCATIONCODE "locationcode#code", 
JOBCODE "jobcode#code",getjob_des (jobcode)     "jobcode#description", 
PIC "pic", COSTCENTER "costcenter",process_flag "process_flag",keluhan "keluhan",workshopcode "workshopcode",v_url_preview_site (
       'WO',
       CASE
           WHEN process_flag IS NULL THEN 'DRAFT'
           ELSE 'APPROVED'
       END)||WORKORDERNO "v_url_preview",
INPUTBY "inputby", to_char(INPUTDATE,'dd-mm-yyyy') "inputdate", 
UPDATEBY "updateby", to_char(UPDATEDATE,'dd-mm-yyyy') "updatedate"
from workorderheader where
    (   WORKORDERNO LIKE UPPER ('%' || :search || '%')
     OR REQESTEDBYDEPT LIKE UPPER ('%' || :search || '%'))
AND TO_CHAR (ORDERDATE, 'mmyyyy') =
    NVL (TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'), 'mmyyyy'),
         TO_CHAR (ORDERDATE, 'mmyyyy'))
order by WORKORDERNO`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}
    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)
    binds.search = (!params.search ? '' : params.search)
    let result

    try {
        result = await database.siteLimitExecute(users, routes, baseQuery, binds)
    } catch (error) {
        callback(error, '')
    }
    callback('', result)
}

module.exports = {
    fetchDataHeader
}



