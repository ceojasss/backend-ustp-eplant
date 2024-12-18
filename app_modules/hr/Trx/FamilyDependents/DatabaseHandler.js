const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  e.empcode "nik_staff", e.empname "empname",employeetype "employeetype",e.rowid "rowid",description "jabatan",to_char(datejoin,'dd-mm-yyyy') "datejoin",to_char(dateterminate,'dd-mm-yyyy')  "dateterminate"
from empmasterepms e,mas_position p where e.id_position= p.code  and (e.empcode like '%'||:search ||'%' or e.empname like upper('%'||:search ||'%'))  order by e.empcode`

/**
   * ! change query table detail
   */

const detailQuery = `SELECT f.ROWID                                             "rowid",
f.tid                                               "tid",
nik_staff                                           "nik_staff",
get_parametervalue ('HR', 'HRM05', relation_id)     "relation_name",
relation_id                                         "relation_id",
 get_parametervalue ('HR', 'HRM03', religion)        "religion_name",
religion                                            "religion",
get_parametervalue ('HR', 'HRM10', stat_med)        "sex_name",
stat_med                                            "stat_med",
id_edctref                                          "id_edctref",
family_name                                         "family_name",
sex                                                 "sex",
blood                                               "blood",
birth_place                                         "birth_place",
TO_CHAR (birth_date, 'dd-mm-yyyy')                  "birth_date",
tinggal                                             "tinggal",
f.inputby                                           "inputby",
TO_CHAR (f.inputdate, 'dd-mm-yyyy hh24:mi')         "inputdate",
f.updateby                                          "updateby",
TO_CHAR (f.updatedate, 'dd-mm-yyyy hh24:mi')        "updatedate"
FROM hr_family f
WHERE nik_staff = :nik_staff
order by relation_id
`
const detailQueryOld = `select f.rowid "rowid",f.tid "tid",
nik_staff "nik_staff",p1.parametervalue "relation_name",relation_id "relation_id", p2.parametervalue "religion_name",religion "religion",p3.parametervalue "sex_name",stat_med "stat_med",id_edctref "id_edctref",family_name "family_name", sex "sex",  noktp "noktp", blood "blood", birth_place "birth_place", to_char(birth_date,'dd-mm-yyyy') "birth_date", id_edctref "id_edctref",tinggal "tinggal" ,f.inputby "inputby", to_char(f.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", f.updateby "updateby",to_char(f.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
from hr_family f, parametervalue p1,parametervalue p2 , parametervalue p3  where nik_staff = :nik_staff and p1.parametercode ='HRM05' and p2.parametercode ='HRM03' and p3.parametercode ='HRM10' and relation_id = p1.parametervaluecode and religion = p2.parametervaluecode and sex=p3.parametervaluecode`
// const detailQuery = `select f.rowid "rowid",
// tid "tid", nik_staff "nik_staff",relation_id "relation_id",p1.parametervalue "relationship", p2.parametervalue "religion",p3.parametervalue "sex",to_number(stat_med) "stat_med",to_number(id_edctref) "id_edctref",family_name "family_name", to_number(sex) "sex", to_number(religion) "religion", noktp "noktp", blood "blood", birth_place "birth_place", to_char(birth_date,'dd-mm-yyyy') "birth_date", id_edctref "id_edctref",tinggal "tinggal" ,f.inputby "inputby", to_char(f.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", f.updateby "updateby",to_char(f.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
// from hr_family f, parametervalue p1,parametervalue p2 , parametervalue p3  where nik_staff = :nik_staff and p1.parametercode ='HRM05' and p2.parametercode ='HRM03' and p3.parametercode ='HRM10' and relation_id = p1.parametervaluecode and religion = p2.parametervaluecode and sex=p3.parametervaluecode`



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


