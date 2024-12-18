const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid", landacqcode "landacqcode", landacqblockcode "landacqblockcode", to_char(landacqdate,'dd-mm-yyyy') "landacqdate", batchno "batchno", remarks "remarks", id "id", id_name "id_name", id_pob "id_pob",
id_dob "id_dob", address "address", other_name "other_name", verified "verified", to_char(dateverified,'dd-mm-yyyy') "dateverified" from landacq2 where  (landacqblockcode LIKE '%' || :search || '%' OR landacqcode LIKE '%' || :search || '%') 
AND TO_CHAR (landacqdate, 'mmyyyy') = NVL (TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'), 'mmyyyy'),TO_CHAR (landacqdate, 'mmyyyy')) order by landacqdate`

/**
 * ! change query table detail
 */
const detailQuery = `select l.rowid "rowid",l.landacqblockcode "landacqcode", l.blockid "blockid",b.description "description", l.hectarage "hectarage",l. block_location "block_location",
l.block_condition "block_condition", l.admin_cost "admin_cost", l.land_cost "land_cost",l.pay_1 "pay_1", l.pay_2 "pay_2", l.inputby "inputby", 
to_char(l.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", l.updateby "updateby", to_char(l.updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from landacqblock2 l, blockmaster b  where l.blockid = b.blockid and landacqblockcode=:landacqblockcode`



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)
    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)

    let result


    //console.log(binds.search, binds.dateperiode)
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
    binds.landacqblockcode = (!params.landacqblockcode ? '' : params.landacqblockcode)

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

