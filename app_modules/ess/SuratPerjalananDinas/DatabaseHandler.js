const _ = require('lodash')
const oracledb = require('oracledb')
// const database = require('../../../../oradb/dbHandler')
const database = require('../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT ROWID          "rowid",
id_spd                                   "id_spd",
no_spd                                   "no_spd",
empcode                                  "empcode",
empname                                  "empname",
div_id                                   "div_id",
jab_id                                   "jab_id",
destination                              "destination",
costing                                  "costing",
TO_CHAR (date_dep, 'dd-mm-yyyy')         "date_dep",  
TO_CHAR (date_arr, 'dd-mm-yyyy')         "date_arr",
objective                                "objective",
approvedby1                              "approvedby1",
TO_CHAR (approvedate1, 'dd-mm-yyyy')     "approvedate1",
approvedby2                              "approvedby2",
TO_CHAR (approvedate2, 'dd-mm-yyyy')     "approvedate2",
approvedby3                              "approvedby3",
TO_CHAR (approvedate3, 'dd-mm-yyyy')     "approvedate3",
status_pd                                "status_pd",
kasbon                                   "kasbon",
kasbon_amt                               "kasbon_amt",
kategori                                 "kategori",
site                                     "site",
pimpro                                   "pimpro",
origin                                   "origin",
identitas_tamu                           "identitas_tamu",
jam_pesawat                              "jam_pesawat",
inputby                                  "inputby",
TO_CHAR (inputdate, 'dd-mm-yyyy')        "inputdate",
updateby                                 "updateby",
TO_CHAR (updatedate, 'dd-mm-yyyy')       "updatedate"
FROM hr_spd_header
WHERE     empcode = :empcode
AND TO_CHAR (approvedate1, 'mmyyyy') =
    DECODE (
        :search,
        NULL, TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'), 'mmyyyy'),
        TO_CHAR (approvedate1, 'mmyyyy'))
ORDER BY empcode ASC`    

/**
   * ! change query table detail
   */
const detailQuery = ` SELECT  rowid "rowid",  
no_spd "no_spd",
to_char(tdate, 'dd-mm-yyyy') "tdate",
remarks "remarks",
inputby                                  "inputby",
 TO_CHAR (inputdate, 'dd-mm-yyyy')        "inputdate",
 updateby                                 "updateby",
 TO_CHAR (updatedate, 'dd-mm-yyyy')       "updatedate",
 num "num" , tid "tid"
FROM hr_spd_detail  WHERE no_spd = :no_spd
`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)
    binds.empcode = users.empcode


    console.log('users : ',binds.empcode);

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
    binds.no_spd = (!params.no_spd ? '' : params.no_spd)

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


