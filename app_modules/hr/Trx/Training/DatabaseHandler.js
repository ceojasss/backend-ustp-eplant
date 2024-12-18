const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",training_id "training_id",training_event "training_event",levels "levels",executor_id "executor_id",
org_name "org_name", places "places",to_char(start_date,'dd-mm-yyyy') "start_date",duration "duration" 
,inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate",updateby "updateby",to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"
 from hr_schedule_training where  (training_id LIKE UPPER('%' || :search || '%') OR training_event LIKE  UPPER('%' || :search || '%') )`

/**
   * ! change query table detail
   */
const detailQuery = `
select h.rowid"rowid", h.nik_staff "nik_staff#code", get_empname(h.nik_staff)"nik_staff#description", h.org_name "org_name",to_char(h.start_date,'dd-mm-yyyy') "start_date",decode(h.executor_id,'0','Internal','1','Eksternal') "executor_id_t",h.executor_id "executor_id",h.point_val "point_val", h.places "places", h.training_id "training_id", h.duration "duration", h.pretest "pretest", h.posttest "posttest",
h.certificateno "certificateno", h.certificateissueby "certificateissueby", to_char(h.certificateissuedate,'dd-mm-yyyy') "certificateissuedate", 
to_char(h.cerificateexpireddate,'dd-mm-yyyy') "cerificateexpireddate", h.inputby "inputby",to_char(h.inputdate,'dd-mm-yyyy hh24:mi') "inputdate", h.updateby "updateby", 
to_char(h.updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from hr_training h, hr_schedule_training s where h.training_id=:training_id and h.training_id= s.training_id
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
    binds.training_id = (!params.training_id ? '' : params.training_id)

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

