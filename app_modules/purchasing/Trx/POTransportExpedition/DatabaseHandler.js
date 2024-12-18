const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select DISTINCT
DOCUMENTCODE "documentcode",to_char(DOCUMENTDATE,'dd-mm-yyyy') "documentdate",POTCODE "potcode",
to_char(etd,'dd-mm-yyyy') "etd",to_char(eta,'dd-mm-yyyy') "eta",
v_url_preview_site (
    'POT',
    CASE WHEN documentcode IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || documentcode "v_url_preview_list",
    v_url_preview_site (
    'PA',
    CASE WHEN documentcode IS NULL THEN 'DRAFT' ELSE 'APPROVED' END) || potcode "v_url_preview",
inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from LPO_EXPEDITION_HEADER
where (documentcode LIKE  UPPER('%' || :search ||'%') OR potcode LIKE  UPPER('%' || :search ||'%') OR inputby LIKE  UPPER('%' || :search ||'%') )
AND TO_CHAR (documentdate, 'mmyyyy') =
 decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
 TO_CHAR (documentdate, 'mmyyyy')) ORDER BY DOCUMENTCODE DESC `


/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid",
DOCUMENTCODE "documentcode",to_char(DOCUMENTDATE,'dd-mm-yyyy') "documentdate",POTCODE "potcode",POCODE "pocode",REMARKS "remarks",
LOCATION "location",DESCRIPTION "description",QUANTITY "quantity",UOM "uom",
to_char(etd,'dd-mm-yyyy') "etd",to_char(eta,'dd-mm-yyyy') "eta",RNCODE "rncode#code",inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from LPO_EXPEDITION_LIST
where documentcode= :documentcode`



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
    binds.documentcode = (!params.documentcode ? '' : params.documentcode)

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






