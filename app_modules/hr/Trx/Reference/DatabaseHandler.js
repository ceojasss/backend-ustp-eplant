const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  e.empcode "nik_staff", e.empname "empname",employeetype "employeetype",e.rowid "rowid", description "jabatan",to_char(datejoin,'dd-mm-yyyy') "datejoin",to_char(dateterminate,'dd-mm-yyyy')  "dateterminate"
from empmasterepms e,mas_position p where e.id_position= p.code  and (e.empcode like '%'||:search ||'%' or e.empname like upper ('%'||:search ||'%'))  order by e.empcode`

/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid", 
tid "tid",nik_staff "nik_staff", name "name",
position "position", company "company", addrs "addrs",
off_phone "off_phone", home_phone "home_phone", mobile_num "mobile_num", email "email",
inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby",to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"  
from hr_references where nik_staff = :nik_staff  `    



const fetchDataHeader = async function (users, params, routes, callback) {

    binds = {}


    binds.limitsize = (!params.size ? 0 : params.size)
    binds.page = (!params.page ? 1 : params.page)
    binds.search = (!params.search ? '' : params.search)

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
    binds.nik_staff = (!params.nik_staff ? '' : params.nik_staff)

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