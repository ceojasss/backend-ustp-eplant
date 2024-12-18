const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select DISTINCT  a.currid "currid",currdesc "currdesc" from currencydtl a left join currencymst b on a.currid = b.currid
where (upper(a.currid) like upper ('%'||:search ||'%') or upper(currdesc) like upper ('%'||:search ||'%')) and
TO_CHAR (exchangedate, 'mmyyyy') =
NVL (TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'), 'mmyyyy'),
     TO_CHAR (exchangedate, 'mmyyyy')) order by a.currid`

/**
   * ! change query table detail
   */
const detailQuery = `select rowid"rowid",currdtlid "currdtlid", currid "currid",dailyrate "dailyrate",to_char(exchangedate, 'dd-mm-yyyy')  "exchangedate", inputby "inputby", to_char(inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from currencydtl where currid = :currid 
AND TO_CHAR (exchangedate, 'mmyyyy') =
NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'),
     TO_CHAR (exchangedate, 'mmyyyy')) order by exchangedate`



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
    binds.currid = (!params.currid ? '' : params.currid)
    binds.period = (!params.period ? '' : params.period)

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

