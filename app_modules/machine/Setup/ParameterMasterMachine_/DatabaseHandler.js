const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
 const baseQuery = `select rowid "rowid", parametercode "parametercode", 
 parametername "parametername",
 controlsystem "controlsystem",
 inputby "inputby", 
 to_char(inputdate, 'dd-mm-yyyy hh24:mi') 
 "inputdate", updateby "updateby", 
 to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" 
 from parameter where upper(controlsystem) = 'MACHINE' and
 (parametercode LIKE  UPPER('%' || :search ||'%') OR 
 parametername LIKE UPPER('%' || :search ||'%')) order by parametercode DESC
 `
 
 /**
    * ! change query table detail
    */
 const detailQuery = `SELECT 
 pv.rowid "rowid" ,
 pv.parametercode "parametercode",
 pv.parametervaluecode "parametervaluecode",
 pv.parametervalue "parametervalue",
 pv.inputby   "inputby",
 to_char(pv.inputdate,'dd-mm-yyyy') "inputdate",
 pv.updateby  "updateby",
 to_char(pv.updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
 pv.uom "uom"
  FROM parametervalue pv, parameter p
 where pv.parametercode = p.parametercode and
 pv.parametercode = :parametercode`


// const detailQuery = `select f.rowid "rowid",
// tid "tid", parametercode "parametercode",relation_id "relation_id",p1.parametervalue "relationship", p2.parametervalue "religion",p3.parametervalue "sex",to_number(stat_med) "stat_med",to_number(id_edctref) "id_edctref",family_name "family_name", to_number(sex) "sex", to_number(religion) "religion", noktp "noktp", blood "blood", birth_place "birth_place", to_char(birth_date,'dd-mm-yyyy') "birth_date", id_edctref "id_edctref",tinggal "tinggal" ,f.inputby "inputby", to_char(f.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", f.updateby "updateby",to_char(f.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate"
// from hr_family f, parametervalue p1,parametervalue p2 , parametervalue p3  where parametercode = :parametercode and p1.parametercode ='HRM05' and p2.parametercode ='HRM03' and p3.parametercode ='HRM10' and relation_id = p1.parametervaluecode and religion = p2.parametervaluecode and sex=p3.parametervaluecode`



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
    binds.parametercode = (!params.parametercode ? '' : params.parametercode)

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


