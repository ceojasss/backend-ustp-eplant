const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `
SELECT   u.rowid "rowid",
u.sivcode  "sivcode#code",
s.inputby "inputbysivdisplayonly",
to_char(s.sivdate,'dd-mm-yyyy') "sivdatedisplayonly",
to_char(s.inputdate,'dd-mm-yyyy') "inputdatesivdisplayonly",
to_char(b.startdate,'dd-mm-yyyy') "startdatesivdisplayonly",
to_char(b.enddate,'dd-mm-yyyy') "enddatesivdisplayonly",
s.storecode "storecodedisplayonly",
referenceno "referenceno#code",
to_char(u.tdate, 'dd-mm-yyyy') "tdate", 
u.reason "reason",
u.updateby "updateby", 
u.process_flag "process_flag",
to_char(u.updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
u.inputby "inputby" ,
to_char(u.inputdate,'dd-mm-yyyy hh24:mi') "inputdate"
FROM update_siv u, siv s ,(select startdate, add_months(enddate,1) enddate from periodctlmst x, periodcontrol y
where upper(system)='STORES'
AND CURRENTACCYEAR= accyear   and CURRENTPERIODSEQ    = periodseq
) b 
WHERE   (
to_char (s.sivdate,'MM/YYYY') = to_char (b.startdate,'MM/YYYY') or
to_char (s.sivdate,'MM/YYYY') = to_char (b.enddate,'MM/YYYY'))  and   u.sivcode = s.sivcode
AND (   u.sivcode LIKE '%' || :search || '%') AND TO_CHAR (u.tdate, 'mmyyyy') =
decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'))
ORDER BY tdate desc`



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
// const fetchDataDetail = async function (users, routes, params, callback) {

//     binds = {}

//     /**
//      * ! change the parameters according to the table
//      */
//     binds.vouchercode = (!params.vouchercode ? '' : params.vouchercode)

//     let result

//     try {
//         result = await database.siteWithDefExecute(users, routes, detailQuery, binds)



//     } catch (error) {
//         callback(error, '')
//     }



//     callback('', result)
// }

module.exports = {
    fetchDataHeader,
    // fetchDataDetail
}


