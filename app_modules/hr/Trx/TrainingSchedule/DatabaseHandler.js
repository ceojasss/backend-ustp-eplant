const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = ` select DISTINCT r.training_id "training_id", r.trainingdesc "description",r.rowid "rowid" from hr_schedule_training s, hr_ref_training r  where s.training_id=r.training_id and
(r.training_id like upper('%'||:search ||'%') or r.trainingdesc like upper('%'||:search ||'%')) order by r.training_id`

/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid", training_event "training_event", training_id "training_id", trainingdesc "trainingdesc", tid"tid", levels "levels", executor_id "executor_id",
to_char(start_date,'dd-mm-yyyy') "start_date", duration "duration", places "places", inputby "inputby", to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
 updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" from hr_schedule_training   where training_id=:training_id order by start_date`



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
