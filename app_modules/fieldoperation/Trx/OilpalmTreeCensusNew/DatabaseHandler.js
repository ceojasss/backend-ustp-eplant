const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select c.rowid "rowid", c.documentno "documentno", to_char(c.hectinspectiondate,'dd-mm-yyyy') "hectinspectiondate",
c.kebun "kebun", o.departmentname "departmentname",c.afdeling "afdeling",o.divisionname "divisionname", c.petugas "petugas" ,e.empname "name",p.parametervalue "parametervalue",
c.inputby "inputby", to_char(c.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", c.updateby "updateby", to_char(c.updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
from censuspokok c, ORGANIZATION o, empmasterepms e, parametervalue p
where  parametercode='FOP99' and p.parametervaluecode = c.authorized and c.kebun = o.departmentcode and c.afdeling=o.divisioncode and c.petugas= e.empcode
and (documentno LIKE '%' ||  :search || '%' OR kebun LIKE '%' || :search || '%') and  TO_CHAR 
(hectinspectiondate, 'mmyyyy') = NVL (TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'), 'mmyyyy'),
TO_CHAR (hectinspectiondate, 'mmyyyy')) order by documentno,hectinspectiondate`

/**
 * ! change query table detail
 */
const detailQuery = ` select rowid "rowid",documentno "documentno",kebun "kebun",afdeling "afdeling", fieldcode "fieldcode",hectplanted "hectplanted",to_char(plantingdate,'dd-mm-yyyy') "plantingdate" ,statustanam "statustanam",plantingpointnum "plantingpointnum",
normaloriginaltress "normaloriginaltress",normalsupplyingtrees "normalsupplyingtrees",prodctiveoriginal "prodctiveoriginal",unproductive "unproductive",productivesuppliying "productivesuppliying",
deadtrees "deadtrees",unproductivesuppliying "unproductivesuppliying", abnormaltrees "abnormaltrees",plantingpointnum "plantingpointnum",sphreal "sphreal",
inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from censuspokok_detail where documentno=:documentno and kebun=:kebun and afdeling=:afdeling`



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
        console.log('eror')
        // callback(error, '')
    }



    callback('', result)
}
const fetchDataDetail = async function (users, routes, params, callback) {

    binds = {}

    /**
   * ! change the parameters according to the table
   */
    binds.documentno = (!params.documentno ? '' : params.documentno)
    binds.kebun = (!params.kebun ? '' : params.kebun)
    binds.afdeling = (!params.afdeling ? '' : params.afdeling)

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


