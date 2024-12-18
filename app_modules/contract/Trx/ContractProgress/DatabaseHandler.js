const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery =`select distinct
a.rowid"rowid",
b.contractorcode"contractordisplayonly#code",
c.contractorname"contractordisplayonly#desc",
a.agreementcode"agreementcode#code",
a.documentno"documentno",
a.description "description",
to_char(a.WIPDATE,'dd-mm-yyyy') "wipdate",
to_char(b.startdate,'dd-mm-yyyy') "startdatedisplayonly",
to_char(b.enddate,'dd-mm-yyyy') "enddatedisplayonly",
to_char(a.inputdate,'dd-mm-yyyy hh24:mi') "inputdate",
v_url_preview_site (
       'WP',
       CASE
           WHEN documentno IS NULL THEN 'DRAFT'
           ELSE 'APPROVED'
       END)
|| documentno ||'&'||'P_AGREEMENT='||a.agreementcode||'&'||'P_CONTRACTOR='||b.contractorcode "v_url_preview",
a.inputby"inputby",a.process_flag "process_flag",
to_char(a.updatedate,'dd-mm-yyyy hh24:mi') "updatedate",
a.updateby"updateby"
from workinprogressheader a, contractagreement b,contractor c where a.agreementcode= b.agreementcode and 
b.contractorcode= c.contractorcode and
(a.agreementcode LIKE  UPPER('%' || :search ||'%') 
OR b.contractorcode LIKE  UPPER('%' || :search ||'%')
OR a.documentno LIKE  UPPER('%' || :search ||'%')
OR a.inputby LIKE  UPPER('%' || :search ||'%')
OR a.description LIKE  UPPER('%' || :search ||'%')
) 
and   
TO_CHAR (wipdate, 'mmyyyy') =
decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
TO_CHAR (wipdate, 'mmyyyy')) ORDER BY a.documentno DESC`


// const baseQuery = `select rowid "rowid",agreementcode "agreementcode",to_char(wipdate,'dd-mm-yyyy') "wipdate",agreementlineno "agreementlineno",qty "qty",postedflag "postedflag",
// pph "pph",ppn "ppn",documentno "documentno",description "description",
// jamsostek "jamsostek",currid "currid",rate "rate",paid "paid",deleted_flag "deleted_flag",
// status_sync "amount_cap",inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate"  from WORKINPROGRESS
// where (agreementcode LIKE  UPPER('%' || :search ||'%') OR description LIKE  UPPER('%' || :search ||'%')) 
// and to_char(wipdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(wipdate,'mmyyyy')) ORDER BY wipdate DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` SELECT a.ROWID                                "rowid",
a.tid                                  "tid",
TO_CHAR (wipdate, 'dd-mm-yyyy')        "wipdate",
documentno                             "documentno",
agreementlineno                        "agreementlineno",
a.AGREEMENTCODE                        "agreementcode",
locationtype                           "locationtypedisplayonly#code",
get_locationdesc (locationtype)        "locationtypedisplayonly#desc",
locationcode                           "locationcodedisplayonly#code",
getloc_des (locationcode)              "locationcodedisplayonly#desc",
job                                    "jobdisplayonly#code",
getjob_des (job)                       "jobdisplayonly#description",
a.DESCRIPTION                          "description",
a.QTY                                  "qty",
b.qty                                  "volumedisplayonly",
NVL (c.unitdone, 0)                    "unitdisplayonly",
b.qty                                  "volumedisplayonly",
--b.qty   - NVL (c.unitdone, 0)        "unitdonecalc",
UOM                                    "uomdisplayonly",
a.qty * a.rate                         "amountdisplayonly",
a.jamsostek                            "jamsostek",
a.RATE                                 "rate",
--AMOUNT "amount",
PPH                                    "pph",
PPN                                    "ppn"
FROM WORKINPROGRESS   a,
agreementdetail  b
LEFT JOIN
(  SELECT agreementcode,
          agreementlineno            lineno,
          NVL (SUM (qty), 0)         unitdone
     FROM workinprogress
    WHERE documentno <> :documentno
 GROUP BY agreementcode, agreementlineno) c
        ON c.agreementcode = b.agreementcode AND c.lineno = b.lineno
WHERE     a.documentno = :documentno
AND a.agreementcode = b.agreementcode
AND b.lineno = a.agreementlineno`


const requestData = `SELECT   agreementcode "agreementcode", lineno "agreementlineno", rate "rate", volume_contract "volumedisplayonly", unitdone "unitdisplayonly",locationtype "locationtypedisplayonly#code",
get_locationdesc(locationtype) "locationtypedisplayonly#desc",locationcode "locationcodedisplayonly#code", getloc_des (locationcode) "locationcodedisplayonly#desc",
job "jobdisplayonly#code",getjob_des(job) "jobdisplayonly#description", uom "uomdisplayonly", pphcode "pph", ppncode "ppn", jamsostek "jamsostek", description "descriptiondisplayonly"
          FROM (SELECT a.agreementcode, a.agreementlineno lineno,
                       a.documentno, c.qty volume_contract, c.rate,
                       NVL (b.unitdone, 0) unitdone, c.locationtype,
                       c.locationcode, c.job, c.uom, a.qty volume,
                       c.description, c.pphcode, c.ppncode, c.jamsostek,
                       c.vegetationtype, c.topografy, c.gulmatype, c.addendumlineno
                  FROM workinprogress a,
                       (SELECT   agreementcode, agreementlineno lineno,
                                 SUM (qty) unitdone
                            FROM workinprogress
                           WHERE agreementcode = :agreementcode
                             AND (   TO_CHAR (wipdate, 'yyyymm') <
                                            TO_CHAR (TO_DATE(:progressdate,'yyyymmdd'), 'yyyymm')
                                  OR (    TO_CHAR (wipdate, 'yyyymm') =
                                             TO_CHAR (TO_DATE(:progressdate,'yyyymmdd'),
                                                      'yyyymm')
                                      AND documentno != nvl(:progressno,'dummy-no')
                                     )
                                 )
                        GROUP BY agreementcode, agreementlineno) b,
                       agreementdetail c
                 WHERE TO_CHAR (a.wipdate, 'yyyymm') =
                                            TO_CHAR (TO_DATE(:progressdate,'yyyymmdd'), 'yyyymm')
                   AND a.agreementcode = b.agreementcode(+)
                   AND a.agreementlineno = b.lineno(+)
                   AND a.agreementcode = c.agreementcode
                   AND a.agreementlineno = c.lineno
                   --AND  NVL(unitdone,0) != c.qty
                   AND a.agreementcode = :agreementcode
                   AND a.documentno = NVL (:progressno, 'xxx')
                UNION
                SELECT a.agreementcode, a.lineno, NULL documentno,
                       a.qty volume_contract, a.rate,
                       NVL (b.unitdone, 0) unitdone, a.locationtype,
                       a.locationcode, a.job, a.uom, NULL volume,
                       a.description, a.pphcode, a.ppncode, a.jamsostek,
                       a.vegetationtype, a.topografy, a.gulmatype, a.addendumlineno
                  FROM agreementdetail a,
                       (SELECT   agreementcode, agreementlineno lineno,
                                 SUM (qty) unitdone
                            FROM workinprogress
                           WHERE agreementcode = :agreementcode
                             AND (   TO_CHAR (wipdate, 'yyyymm') <
                                            TO_CHAR (TO_DATE(:progressdate,'yyyymmdd'), 'yyyymm')
                                  OR (TO_CHAR (wipdate, 'yyyymm') =
                                            TO_CHAR (TO_DATE(:progressdate,'yyyymmdd'), 'yyyymm')
                                     )
                                 )
                        GROUP BY agreementcode, agreementlineno) b
                 WHERE a.agreementcode = :agreementcode
                   AND to_date(:progressdate,'yyyymmdd') <= a.duedate
                   AND a.agreementcode = b.agreementcode(+)
                   AND a.lineno = b.lineno(+)
                   --AND  NVL(unitdone,0) != qty
                   AND NOT EXISTS (
                          SELECT *
                            FROM workinprogress x
                           WHERE x.agreementcode = a.agreementcode
                             AND x.agreementlineno = a.lineno
                             AND x.documentno =
                                               NVL (:progressno, 'xxx')
                             AND TO_CHAR (x.wipdate, 'yyyymm') =
                                            TO_CHAR (TO_DATE(:progressdate,'yyyymmdd'), 'yyyymm')))
      ORDER BY agreementcode, lineno`


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
    binds.documentno = (!params.documentno ? '' : params.documentno)

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



    binds.progressdate = (!params.progressdate ? '' : params.progressdate)
    binds.progressno = (!params.progressno ? '' : params.progressno)
    binds.agreementcode = (!params.agreementcode ? '' : params.agreementcode)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, requestData, binds)

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

