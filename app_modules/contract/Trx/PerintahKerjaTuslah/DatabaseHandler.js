const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')


/**
 * ! change query table header
 */
const baseQuery = `  SELECT ROWID
"rowid",
agreementcode
"agreementcode",
description
"description",
TO_CHAR (agreementdate, 'dd-mm-yyyy')
"agreementdate",
contractorcode
"contractorcode#code",
get_contractorname (contractorcode)
"contractorcode#description",
TO_CHAR (startdate, 'dd-mm-yyyy')
"startdate",
TO_CHAR (enddate, 'dd-mm-yyyy')
"enddate",
currid
"currid",
rate
"rate",
closed
"closed",
topcode
"topcode",
requestno
"requestno",
process_flag
"process_flag",
inputby
"inputby",
TO_CHAR (inputdate, 'dd-mm-yyyy hh24:mi')
"inputdate",
updateby
"updateby",
TO_CHAR (updatedate, 'dd-mm-yyyy hh24:mi')
"updatedate",
pricebbm
"pricebbm",
v_url_preview_site (
   'CAT',
   CASE
           WHEN process_flag IS NULL THEN 'DRAFT'
           ELSE 'APPROVED'
   END)
|| agreementcode
"v_url_preview",
pricebbm_start
"pricebbm_start",
pricebbm_end
"pricebbm_end",
pricerange
"pricerange",
spk_no
"spk_no"
FROM contractagreement_ctl
WHERE     (   agreementcode LIKE UPPER ('%' || :search || '%')
OR agreementdate LIKE UPPER ('%' || :search || '%')
OR description LIKE UPPER ('%' || :search || '%')
OR spk_no LIKE UPPER ('%' || :search || '%')
) AND
TO_CHAR (agreementdate, 'mmyyyy') =
decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
TO_CHAR (agreementdate, 'mmyyyy'))
ORDER BY agreementdate DESC`

/**
   * ! change query table detail
   */
const detailQuery = ` select rowid "rowid" ,
tid "tid",agreementcode "agreementcode", lineno "lineno",
job||' - '||getjob_des(job) "job", to_char(duedate, 'dd-mm-yyyy') "duedate", qty "qty", rate "rate", amount "amount",
uom "uom", description "description", pphcode "pphcode", ppncode "ppncode",
inputby "inputby",to_char(inputdate,'dd-mm-yyyy hh24:mi') "inputdate", updateby "updateby", to_char(updatedate,'dd-mm-yyyy hh24:mi') "updatedate" ,
rfpercentage "rfpercentage",
rfflag  "rfflag"
from agreementdetail_ctl
where agreementcode= :agreementcode`

const detailwithsub = `SELECT c.ROWID                                              "rowid",
c.tid                                                "tid",
c.agreementcode                                      "agreementcode",
c.lineno                                             "lineno",
c.locationtype                                       "locationtype",
job                                                  "job#code",
getjob_des (job)                                     "job#description",
TO_CHAR (c.duedate, 'dd-mm-yyyy')                    "duedate",
c.qty                                                "qty",
c.rate                                               "rate",
c.amount                                             "amount",
c.uom                                                "uom",
c.description                                        "description",
c.pphcode                                            "pphcode#code",
pph.DESCRIPTION                                      "pphcode#description",
c.ppncode                                            "ppncode#code",
ppn.DESCRIPTION                                      "ppncode#description",
c.inputby                                            "inputby",
TO_CHAR (c.inputdate, 'dd-mm-yyyy hh24:mi')          "inputdate",
c.updateby                                           "updateby",
TO_CHAR (c.updatedate, 'dd-mm-yyyy hh24:mi')         "updatedate",
h.tid                                                "sub#tid",
h.lineno                                             "sub#lineno",
h.ROWID                                              "sub#rowid",
h.mulai                                              "sub#mulai",
h.akhir                                              "sub#akkhir",
h.hargaavg                                           "sub#hargaavg",
h.harga                                              "sub#tharga"
FROM agreementdetail_ctl  c
LEFT JOIN harga_bbm h
        ON h.agreementcode = c.agreementcode AND h.lineno = c.lineno
LEFT JOIN taxmaster ppn ON ppn.taxcode = c.ppncode
LEFT JOIN taxmaster pph ON pph.taxcode = c.pphcode
WHERE c.agreementcode = :agreementcode`

const details = `SELECT c.ROWID                                              "rowid",
c.tid                                                "tid",
c.agreementcode                                      "agreementcode",
c.lineno                                             "lineno",
c.locationtype                                       "locationtype",
job                                                  "job#code",
getjob_des (job)                                     "job#description",
TO_CHAR (c.duedate, 'dd-mm-yyyy')                    "duedate",
c.qty                                                "qty",
c.rate                                               "rate",
c.amount                                             "amount",
c.uom                                                "uom",
c.description                                        "description",
c.pphcode                                            "pphcode#code",
pph.DESCRIPTION                                      "pphcode#description",
c.ppncode                                            "ppncode#code",
ppn.DESCRIPTION                                      "ppncode#description",
c.inputby                                            "inputby",
TO_CHAR (c.inputdate, 'dd-mm-yyyy hh24:mi')          "inputdate",
c.updateby                                           "updateby",
TO_CHAR (c.updatedate, 'dd-mm-yyyy hh24:mi')         "updatedate"
FROM agreementdetail_ctl  c
LEFT JOIN taxmaster ppn ON ppn.taxcode = c.ppncode
LEFT JOIN taxmaster pph ON pph.taxcode = c.pphcode
WHERE c.agreementcode = :agreementcode
order by c.lineno`


const subdetail = `SELECT h.ROWID                 "rowid",
h.agreementcode         "agreementcode",
h.tid                   "tid",
h.lineno                "lineno",
h.mulai                 "mulai",
h.akhir                 "akhir",
h.hargaavg              "hargaavg",
h.harga                 "harga"
FROM harga_bbm h
WHERE     h.agreementcode = :agreementcode
order by h.lineno`


const requestData = `SELECT requestcode "requestcode",
lineno "lineno",
locationtype "locationtype",
jobcode "job#code",
getjob_des(jobcode) "job#description",
remarks "description",
request_vol "qty",
request_rate "rate",
vegetationtype "vegetationtype",
topografy "topografy",
gulmatype "gulmatype",
uomcode "uom"
FROM contractrequestdetail
WHERE     lineno NOT IN (SELECT distinct lineno
    FROM agreementdetail_ctl a, contractagreement_ctl c
   WHERE a.agreementcode = c.agreementcode and c.requestno = :requestno and nvl(a.rate,0) <> 0)
AND requestcode = :requestno
ORDER BY lineno`

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
        result = await database.fetchDetailSubDetail(users, routes, details, subdetail, binds)

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



    binds.requestno = (!params.crcode ? '' : params.crcode)

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
