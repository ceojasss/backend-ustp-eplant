const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
 const baseQuery = `select DISTINCT i.rowid "rowid",documentno "documentno",to_char(statusdate,'dd-mm-yyyy') "statusdate",
 year "year",month "month",inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
 updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
 from Infrastructurestatusheader i  left join organization o On i.estate = o.departmentcode left join organization n On i.division = n.divisioncode where (documentno LIKE '%' || :search ||'%' OR year LIKE '%' || :search ||'%')
 and to_char(statusdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),
 to_char(statusdate,'mmyyyy')) 
 `;
//  const baseQuery = `select DISTINCT i.rowid "rowid",documentno "documentno",to_char(statusdate,'dd-mm-yyyy') "statusdate",
//  NVL(estate,'') "estate#code",NVL(o.departmentname,'') "estate#description",NVL(division,'') "division#code",NVL(n.divisionname,'') "division#description",inspektor "inspektor",
//  iftype "iftype#code",iftype "iftype#description",ifsubtype "ifsubtype#code",ifsubtype "ifsubtype#description", 
//  year "year",month "month",inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", 
//  updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
//  from Infrastructurestatusheader i  left join organization o On i.estate = o.departmentcode left join organization n On i.division = n.divisioncode where (documentno LIKE '%' || :search ||'%' OR year LIKE '%' || :search ||'%')
//  and to_char(statusdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),
//  to_char(statusdate,'mmyyyy')) 
//  `;
 
 /**
  * ! change query table detail
  */
 const detailQuery = `select rowid "rowid",
 tid "tid",documentno "documentno",ifcode "ifcode#code",
 ifcode "ifcode#description",ifname "ifname",
 iftype "iftype#code",iftype "iftype#description", 
 ifsubtype "ifsubtype#code",ifsubtype "ifsubtype#description", 
 estate "estate#code",division "division",status "status",inputby "inputby",
 to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", 
 to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" 
 from InfrastructureStatusDetails where documentno=:documentno
 `;



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
    binds.documentno = (!params.documentno ? '' : params.documentno)

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
