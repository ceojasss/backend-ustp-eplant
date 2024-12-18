const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT  DISTINCT og.ROWID "rowid", 
og.DEPARTMENTCODE "estatecode",
og.DEPARTMENTNAME "departmentname",
og.DIVISIONCODE "divisioncode",
og.DIVISIONNAME "divisionname",
bm.CONCESSIONID "concessionid"
FROM organization og, blockorg bo, blockmaster bm
WHERE og.INACTIVEDATE IS NULL 
and og.departmentcode = bo.estatecode
and og.divisioncode = bo.divisioncode
and bo.blockid = bm.blockid
and ( upper(DEPARTMENTCODE) like '%'||:search||'%' )  
order by og.DEPARTMENTCODE `

/**
 * ! change query table detail
 */
 const detailQuery = ` SELECT ROWID "rowid", TID "tid", ESTATECODE "estatecode", 
 DIVISIONCODE "divisioncode",BLOCKID "blockid#code", CONCESSIONID "concessionid",
 NVL (getloc_des(blockid) , 'NA') "blockid#description",
 to_char(INPUTDATE,'dd-mm-yyyy  hh24:mi') "inputdate",
 to_char(UPDATEDATE,'dd-mm-yyyy  hh24:mi') "updatedate",
 INPUTBY "inputby",
 UPDATEBY "updateby",
 to_char(INACTIVEDATE,'dd-mm-yyyy') "inactivedate"
 FROM blockorg
 WHERE ESTATECODE = :estatecode AND DIVISIONCODE = :divisioncode`


const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)

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
    binds.estatecode = (!params.estatecode ? '' : params.estatecode)
    binds.divisioncode = (!params.divisioncode ? '' : params.divisioncode)
    // binds.period = (!params.period ? '' : params.period)

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


