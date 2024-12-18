const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  e.rowid"rowid", e.empcode "empcode", e.empname "empname", e.othername "othername", e.birth_place "birth_place", to_char(e.dob,'dd-mm-yyyy') "dob", e.nationality "nationality", e.sex"sex", e.maritalstatus"maritalstatus", to_char(e.datemarried,'dd-mm-yyyy') "datemarried", e.religion "religion", e.blood_type "blood_type", e.numberofchild "numberofchild", e.address "address", e.address3 "address3", e.zipcode "zipcode", e.address2 "address2", e.mobilepohneno "mobilepohneno", e.emailaddr "emailaddr", e.prov_code "prov_code", e.city_code"city_code", e.district_code "district_code", e.village_code "village_code", e.email"email", e.size_baju "size_baju", e.size_celana"size_celana",e.size_sepatu"size_sepatu",e.size_kepala"size_kepala", to_char(e.companybegin,'dd-mm-yyyy')"companybegin",to_char(e.datejoin,'dd-mm-yyyy')"datejoin", to_char(e.dateterminate,'dd-mm-yyyy') "dateterminate", e.familystatustax "familystatustax", e.npwp "npwp", e.noktp "noktp", e.mother_name"mother_name", e.paymentmethod"paymentmethod", e.bankname"bankname",e.bankaccountno"bankaccountno", e.pensionplanid"pensionplanid", to_char(e.pensionplanstartdate, 'dd-mm-yyyy')"pensionplanstartdate",e.remarks"remarks",e.costcenter"costcenter", e.departmentcode"departmentcode",e.divisioncode "divisioncode", e.id_position"id_position", e.jobspeccode"jobspeccode", e.workinglocation"workinglocation", e.workinglocationtype"workinglocationtype", e.nojamsostek"nojamsostek",to_char(e.jamsostekstartdate, 'dd-mm-yyyy')"jamsostekstartdate", e.jamsostekpkt "jamsostekpkt", e.lifeinsuranceno"lifeinsuranceno", to_char(e.lifeinsurancestartdate,'dd-mm-yyyy')"lifeinsurancestartdate", e.stm"stm", e.familystatusjamsostek "familystatusjamsostek", e.dobc"dobc", e.inputby "inputby", e.updateby "updateby", to_char(e.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", to_char(e.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate",description "jabatan",employeetype "employeetype"
from empmasterepms e,mas_position p where e.id_position= p.code  and (e.empcode like '%'||:search ||'%' or e.empname like '%'||:search ||'%')  order by e.empcode`

/**
   * ! change query table detail
   */
const detailQuery = ` SELECT e.rowid"rowid", e.empcode "empcode", e.empname "empname",
 e.othername "othername", e.birth_place "birth_place", to_char(e.dob,'dd-mm-yyyy') "dob", 
 e.nationality "nationality", e.sex"sex", e.maritalstatus"maritalstatus",
  to_char(e.datemarried,'dd-mm-yyyy') "datemarried", e.religion "religion", 
  e.blood_type "blood_type", e.numberofchild "numberofchild", e.address "address", 
  e.address3 "address3", e.zipcode "zipcode", e.address2 "address2", e.mobilepohneno "mobilepohneno", 
  e.emailaddr "emailaddr", e.prov_code "prov_code", e.city_code"city_code", e.district_code "district_code", 
  e.village_code "village_code", e.email"email", e.size_baju "size_baju", e.size_celana"size_celana",
  e.size_sepatu"size_sepatu",e.size_kepala"size_kepala", to_char(e.companybegin,'dd-mm-yyyy')"companybegin",
  to_char(e.datejoin,'dd-mm-yyyy')"datejoin", to_char(e.dateterminate,'dd-mm-yyyy') "dateterminate", 
  e.familystatustax "familystatustax", e.npwp "npwp", e.noktp "noktp", e.mother_name"mother_name", 
  e.paymentmethod"paymentmethod", e.bankname"bankname",e.bankaccountno"bankaccountno", e.pensionplanid"pensionplanid", 
  to_char(e.pensionplanstartdate, 'dd-mm-yyyy')"pensionplanstartdate",e.remarks"remarks",
  e.costcenter"costcenter", e.departmentcode"departmentcode",e.divisioncode "divisioncode", 
  e.id_position"id_position", e.jobspeccode"jobspeccode", e.workinglocation"workinglocation",
  e.workinglocationtype"workinglocationtype", e.nojamsostek"nojamsostek",
  to_char(e.jamsostekstartdate, 'dd-mm-yyyy')"jamsostekstartdate", e.jamsostekpkt "jamsostekpkt", 
  e.lifeinsuranceno"lifeinsuranceno", to_char(e.lifeinsurancestartdate,'dd-mm-yyyy')"lifeinsurancestartdate", 
  e.stm"stm", e.familystatusjamsostek "familystatusjamsostek", e.dobc"dobc", e.inputby "inputby",
   e.updateby "updateby", to_char(e.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", 
   to_char(e.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
  from empmasterepms e, mas_position p where e.empcode = :empcode and  p.code = e.id_position`



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
    binds.empcode = (!params.empcode ? '' : params.empcode)

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

