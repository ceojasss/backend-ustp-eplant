const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
 const baseQuery = `select "rowid", "nik_staff#code", "nik_staff#description", TO_CHAR ("docdate", 'dd-mm-yyyy') "docdate", "docnum", "patient_name", RELATION, "med_rawat_id", "rawat_description", 
 "doctor", "nurse", "diagnosis", "rujukan", "process_flag", "tglawalijin", "tglakhirijin", "tglkontrol", 
 "inputby", "inputdate", "updateby", "updatedate", "v_url_preview", 
 "diagnosis1", "diagnosis2", "diagnosis3", "diagnosis1_desc", "diagnosis2_desc", "diagnosis3_desc" 
 from view_HR_MEDICAL_INT_consol
 WHERE (   "docnum" LIKE UPPER ('%' || :search || '%')
 OR "nik_staff#code" LIKE UPPER ('%' || :search || '%')
 OR "diagnosis" LIKE UPPER ('%' || :search || '%')
 OR "inputby" LIKE UPPER ('%' || :search || '%')
 OR UPPER("patient_name") LIKE UPPER ('%' || :search || '%')
 OR "doctor" LIKE UPPER ('%' || :search || '%'))
 AND TO_CHAR ("docdate", 'mmyyyy') =
 decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
 TO_CHAR ("docdate", 'mmyyyy'))order by "inputdate",TDATE DESC`
 
 /**
    * ! change query table detail
    */
 const detailQuery = ` select row_id "rowid", tid "tid",
 docnum "docnum", 
 to_char(tdate,'dd-mm-yyyy') "tdate", 
 itemcode "itemcode#code",
 get_purchaseitemname(itemcode) "itemcode#description",
 itemname "itemname",
 qty "qty",
 get_med_stock(itemcode,tdate) "stockdisplayonly",
get_med_stock(itemcode,tdate) - qty "sisadisplayonly",
 uomcode "uomcode",
 dosis "dosis",
 remarks "remarks",
 inputby   "inputby",
 to_char(inputdate,'dd-mm-yyyy') "inputdate",
 updateby  "updateby",
 to_char(updatedate,'dd-mm-yyyy') "updatedate"
 from hr_medical_int_detail_consol
 where docnum= :docnum`



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
    binds.docnum = (!params.docnum ? '' : params.docnum)

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
