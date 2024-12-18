const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
// const baseQuery = `select rowid "rowid",to_char(tdate,'dd-mm-yyyy') "tdate",estate "estate",division "division",ifgroup "ifgroup",
// ifsubgroup "ifsubgroup",status "status",inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from InfrastructureProgress
// where (periode LIKE '%' || :search ||'%' OR ifgroup LIKE '%' || :search ||'%')
//   and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) ORDER BY tdate DESC`
const baseQuery = `select i.rowid "rowid",to_char(tdate,'dd-mm-yyyy') "tdate",estate "estate_code",estate "estate#code",o.departmentname "estate#description",division "division_code",division "division#code",o.divisionname "division#description",ifgroup "ifgroup_code",ifgroup "ifgroup#code",it.iftypename "ifgroup#description",
ifsubgroup "ifsubgroup_code",ifsubgroup "ifsubgroup#code",ist.ifsubtypename "ifsubgroup#description",status "status",i.inputby "inputby",to_char(i.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", i.updateby "updateby", to_char(i.updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from InfrastructureProgress i, organization o, infrastructuretype it,infrastructuresubtype ist
where (periode LIKE UPPER ('%' || :search ||'%') OR ifgroup LIKE UPPER ('%' || :search ||'%') OR ifsubgroup LIKE UPPER ('%' || :search || '%') OR ist.ifsubtypename LIKE ('%' || :search || '%') OR it.iftypename LIKE ('%' || :search || '%')) 
and estate=o.departmentcode and division=o.divisioncode and ifgroup= it.iftype and ifsubgroup = ist.ifsubtype and it.iftype = ist.iftype
  and to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) ORDER BY tdate DESC` 


/**
   * ! change query table detail
   */
const detailQuery = `SELECT "rowid","periode","tid","tdate","estate_code","estate#code","division_code","division#code","ifgroup#code","ifgroup_code","ifsubgroup_code","ifsubgroup#code",xx.kode "kode#code",f.ifname "kode#description" 
,"jenisperawatan#code","jenisperawatan#description","uom","prestasi","latitude1_x","latitude1_y","tdate_kerja","inputby","inputdate","updateby","updatedate","tdate_ukur","keterangan", "latitude2_x","latitude2_y","division#description","estate#descrpition","ifgroup#description","ifsubgroup#description" FROM(select ifd.rowid "rowid",periode "periode",
tid "tid",to_char(tdate,'dd-mm-yyyy') "tdate",ifd.estate "estate_code",ifd.estate "estate#code",o.departmentname "estate#descrpition",ifd.division "division_code",ifd.division "division#code",o.divisionname "division#description",ifgroup "ifgroup#code",it.iftypename "ifgroup#description",ifgroup "ifgroup_code",
ifsubgroup "ifsubgroup_code",ifsubgroup "ifsubgroup#code",ist.ifsubtypename "ifsubgroup#description",kode,jenisperawatan "jenisperawatan#code",getjob_des(jenisperawatan) "jenisperawatan#description",ifd.uom "uom",
keterangan "keterangan",to_char(tdate_ukur,'dd-mm-yyyy') "tdate_ukur",prestasi "prestasi",ifd.latitude1_x "latitude1_x",ifd.latitude1_y "latitude1_y",ifd.latitude2_x "latitude2_x",ifd.latitude2_y "latitude2_y",to_char(tdate_kerja,'dd-mm-yyyy') "tdate_kerja",ifd.inputby "inputby",to_char(ifd.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", ifd.updateby "updateby", to_char(ifd.updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from InfrastructureProgressDetail ifd,organization o, INFRASTRUCTURESUBTYPE ist,INFRASTRUCTURETYPE it 
where ifd.estate=:estate
and    ifd.division=:division
and ifd.division=o.divisioncode
and ifd.estate=o.departmentcode
and ifd.ifgroup= it.iftype
and ifd.ifsubgroup = ist.ifsubtype
and it.iftype=ist.iftype
and ifgroup=:ifgroup
and ifsubgroup=:ifsubgroup
--and tdate=:tdate
and to_char(tdate,'ddmmyyyy') = nvl(to_char(TO_DATE(:tdate, 'DD-MM-YYYY'),'ddmmyyyy'),to_char(tdate,'ddmmyyyy'))
)xx left join infrastructure f on xx.kode=f.ifcode ORDER BY "tdate"
`
 


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
    binds.tdate = (!params.tdate ? '' : params.tdate)
    binds.estate = (!params.estate ? '' : params.estate)
    binds.division = (!params.division ? '' : params.division)
    binds.ifgroup = (!params.ifgroup ? '' : params.ifgroup)
    binds.ifsubgroup = (!params.ifsubgroup ? '' : params.ifsubgroup)
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
