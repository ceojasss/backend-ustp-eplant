const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `SELECT o.ROWID"rowid",o.emptype"emptype",o.fbtype "fbtype", o.fbdesc "fbdesc", o.allowcode "allowcode", o.deductioncode "deductioncode", to_char (e.startdate, 'dd-mm-yyyy') "startdate", o.inputby "inputby", to_char(o.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", o.updateby "updateby", to_char(o.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" FROM OTHERFBTYPE o, empotherfbrange e where o.emptype = e.emptype and to_char (e.startdate, 'mmyyyy') = NVL (TO_CHAR (TO_DATE ( :dateperiode, 'MM/YYYY'), 'mmyyyy'),TO_CHAR (e.startdate, 'mmyyyy')) and (o.emptype like '%'||:search ||'%' or o.fbtype like '%' ||:search||'%') order by o.emptype`

const detailQuery = `SELECT o.rowid"rowid", o.allowcode "allowcode", o.EMPTYPE "emptype", o.fbformula "fbformula", o.labour_union "labour_union", o.fixrate "fixrate", o.factor "factor", to_char(e.startdate, 'dd-mm-yyyy') "startdate", to_char(e.enddate, 'dd-mm-yyyy') "enddate", e.month "month", e.inputby "inputby", e.updateby "updateby", to_char(e.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", to_char(e.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from otherfbtype o, empotherfbrange e WHERE o.emptype = e.emptype and o.emptype = :emptype and to_char (e.startdate, 'mmyyyy') = NVL (TO_CHAR (TO_DATE ( :period, 'MM/YYYY'), 'mmyyyy'),
TO_CHAR (e.startdate, 'mmyyyy')) order by e.startdate`



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
    binds.emptype = (!params.emptype ? '' : params.emptype)
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