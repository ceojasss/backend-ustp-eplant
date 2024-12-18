const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select e.empcode "nik_staff", e.empname "empname",employeetype "employeetype",e.rowid "rowid", description "jabatan",to_char(datejoin,'dd-mm-yyyy') "datejoin",to_char(dateterminate,'dd-mm-yyyy')  "dateterminate"
from empmasterepms e,mas_position p where e.id_position= p.code  and (e.empcode like '%'||:search ||'%' or e.empname like upper ('%'||:search ||'%'))  order by e.empcode`

/**
   * ! change query table detail
   */
const detailQuery = `
select rowid "rowid",accred "accred",notes "notes",
decode(edlevel,'1','Akreditasi A+','2','Akreditasi A','3','Akreditasi B','4','Akreditasi C','5','Akreditasi Diakui','6','Akreditasi Terdaftar') "accred_t",
decode(edlevel,'1','TDK SKLH','2','SD','3','SMP','4','SMU','5','SMK','6','D1','7','D2','8','D3','9','D4','10','S1','11','S2','12','S3') "edlevel_t",
decode(institut,'1','TEST','2','ITB','3','IPB','4','ITS','5','UAJY','6','UKRIDA','7','UI','8','UISU','9','UGM','10','UNSOED','11','UNPAD','12','UT','90','SD','91','SMP','92','SMU','93','SMK') "institut_t",
decode(lect_name,'N/A','N/A','1','Ekonomi Manajemen','2','Ekonomi Akuntansi','3','Ekonomi Pembangunan','4','Teknik Sipil','5','Teknik Arsitektur','6','Teknik Elektro','7','Teknik Informatika','8','Teknik Mesin','9','Teknik Industri','10','Teknik Pertanian','11','Teknologi Hasil Peternakan','12','Bahasa Inggris') "lect_name_t",
tid "tid", nik_staff "nik_staff",seqlevel "seqlevel", edlevel "edlevel",fg_abroad "fg_abroad", lect_name "lect_name", institut "institut", place "place", gpa_val "gpa_val", to_char(beg_date,'dd-mm-yyyy') "beg_date",to_char(end_date,'dd-mm-yyyy') "end_date", 
inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby",to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from hr_education  where nik_staff=:nik_staff
`



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


