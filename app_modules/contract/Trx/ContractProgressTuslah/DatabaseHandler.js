const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select rowid "rowid",agreementcode "agreementcode",to_char(wipdate,'dd-mm-yyyy') "wipdate",agreementlineno "agreementlineno",
qty "qty",postedflag "postedflag", pph "pph",ppn "ppn",documentno "documentno",description "description",
jamsostek "jamsostek",currid "currid",rate "rate",paid "paid",deleted_flag "deleted_flag",
status_sync "amount_cap",inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby",
 to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" , locationtype "locationtype", locationcode "locationcode",jobcode "jobcode", pricebbm "preicebbm" 
from WORKINPROGRESS_CTL
where (agreementcode LIKE  UPPER('%' || :search ||'%') OR documentno LIKE  UPPER('%' || :search ||'%'))
  and to_char(wipdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(wipdate,'mmyyyy')) ORDER BY wipdate DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` SELECT b.rowid "rowid",tid "tid",DOCUMENTNO "progressno",WIPDATE "wipdate",B.AGREEMENTCODE "agreementcode",to_char(startdate,'dd-mm-yyyy') "startdate",
to_char(enddate,'dd-mm-yyyy') "enddate",D.DESCRIPTION "description",CONTRACTORCODE "contractorcode",C.DESCRIPTION "contractorname",
D.LOCATIONTYPE "locationtype",D.LOCATIONCODE "locationcode",B.QTY "volume",UOM "uom",B.RATE "unitprice", 
AMOUNT "amount",PPHCODE "pphcode",PPNCODE "ppncode",  D.QTY "wipqty",to_char(wipdate,'dd-mm-yyyy') "wipdate" 
FROM CONTRACTAGREEMENT_CTL A, AGREEMENTDETAIL_CTL B,LOCATION C, WORKINPROGRESS_CTL D 
WHERE A.AGREEMENTCODE=B.AGREEMENTCODE AND CONTRACTORCODE=C.LOCATIONCODE AND A.AGREEMENTCODE=D.AGREEMENTCODE
AND B.AGREEMENTCODE=:AGREEMENTCODE`

const caData = `SELECT a.AGREEMENTCODE "agreementcode",a.LINENO "agreementlineno",
a.JOB "jobcode",a.JOB||' ' ||getjob_des (a.job) "jobdisplayonly",to_char(a.DUEDATE,'dd-mm-yyyy'), a.duedate "duedate",a.RETENTION "retention",
a.QTY "agreementqty",SUM (w.qty) "unitdisplayonly",a.QTY - SUM (w.qty) "balance",a.RATe "rate",
a.UOM  "uomdisplayonly",a.JOBNO "linejobno",a.DESCRIPTION "descriptiondisplayonly",/*a.AMOUNT "amount",*/
a.HARGATUSLAH "hargatuslah",a.LOCATIONTYPE "locationtype",a.TEMPLCODE "templcode",a.TID "tid"
FROM agreementdetail_ctl a
LEFT JOIN workinprogress_ctl w ON a.agreementcode = w.agreementcode AND a.lineno = w.agreementlineno and w.documentno not in :progressno
WHERE a.agreementcode = :agreementcode
GROUP BY a.AGREEMENTCODE,a.LINENO,a.JOB,a.DUEDATE,a.RETENTION,a.QTY,
a.RATE,a.UOM,a.JOBNO,a.DESCRIPTION,a.AMOUNT,a.HARGATUSLAH,a.LOCATIONTYPE,a.TEMPLCODE,a.TID
HAVING a.QTY - SUM (w.qty) > 0
ORDER BY jobno`

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
    binds.agreementcode = (!params.agreementcode ? '' : params.agreementcode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}


const fetchDataLinkDetails = async function (users, routes, params, callback) {

    binds = {}

    /**
     * ! change the parameters according to the table
     */



    //    binds.progressdate = (!params.progressdate ? '' : params.progressdate)
    binds.progressno = (!params.progressno ? '' : params.progressno)
    binds.agreementcode = (!params.agreementcode ? '' : params.agreementcode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, caData, binds)

    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    fetchDataLinkDetails

}

