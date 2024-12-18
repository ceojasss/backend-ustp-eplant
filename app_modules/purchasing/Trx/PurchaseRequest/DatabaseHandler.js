const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid" ,prcode "prcode", to_char(prdate, 'dd-mm-yyyy')  "prdate", 
CASE
 WHEN prcode like '%HO%'
 THEN
        v_url_preview_site (
            'PR',
            CASE
                WHEN process_flag IS NULL THEN 'DRAFT'
                ELSE 'APPROVED'
            END)
     || prcode
 ELSE 
 v_url_preview_site (
    'PRSO',
    CASE WHEN process_flag IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || prcode
 END 
 "v_url_preview",prrequestfrom "prrequestfrom", prnotes "prnotes",decode(prpriority,1,'Reguler',2,'Emergency') "prpriority_desc",prpriority "prpriority",closed "closed",  
process_flag "process_flag",inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from lpr
where (prcode LIKE  UPPER('%' || :search ||'%') OR prnotes LIKE  UPPER('%' || :search ||'%') OR inputby LIKE  UPPER('%' || :search ||'%') )
and case when :loginid not like '%HO' and prcode like '%HO%' then null  else prcode end = prcode
AND TO_CHAR (prdate, 'mmyyyy') =
 decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
 TO_CHAR (prdate, 'mmyyyy')) ORDER BY prdate DESC`


/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid" ,
tid "tid",prcode "prcode", itemcode "itemcode#code", get_purchaseitemname(itemcode) "itemcode#description", itemdescription "itemdescription",
uomcode "uomcode",  purchasing_site "purchasing_site", quantity "quantity", to_char(expectdate,'dd-mm-yyyy') "expectdate", ownerestimateprice "ownerestimateprice", poissued "poissued", canceled "canceled", ordered_qty "ordered_qty", approved_quantity "approved_quantity", budget_prc_qty "butget_prc_qty", budget_prc_used "budget_prc_used", budget_prc_avb "budget_prc_avb",
destination "destination", remarks "remarks", jobcode "jobcode#code", getjob_des(jobcode) "jobcode#description", locationtype "locationtype#code", get_locationdesc(locationtype) "locationtype#description",
locationcode "locationcode#code", getloc_des(locationcode) "locationcode#description", inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from lprdetails
where prcode= :prcode`



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
    binds.prcode = (!params.prcode ? '' : params.prcode)

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






