const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `SELECT parametervaluecode          "code",
       parametervalue              "description",
       gl.sourcetype               "gl",
       pc.currentperiodseq         "monthmodule",
       pc.currentaccyear           "yearmodule",
       pr.monthopen                "monthopen",
       pr.yearopen                 "yearopen",
       pra.monthaudit              "monthaudit",
       pra.yearaudit               "yearaudit"
  FROM epmsapps.parametervalue v
       LEFT JOIN
       (SELECT DISTINCT sourcetype
          FROM costbook
         WHERE tdate BETWEEN TRUNC (TO_DATE ( :v_date, 'dd-mm-yyyy'),
                                    'MONTH')
                         AND LAST_DAY (TO_DATE ( :v_date, 'dd-mm-yyyy'))) gl
               ON v.parametervaluecode = gl.sourcetype
       LEFT JOIN
       (SELECT 'GLB111'             groupcode,
               pr.accyear           yearopen,
               pr.periodseq         monthopen
          FROM periodctlmst pr
         WHERE pr.isclosed = 0) pr
               ON v.parametercode = pr.groupcode
       LEFT JOIN
       (SELECT 'GLB111'              groupcode,
               pra.accyear           yearaudit,
               pra.periodseq         monthaudit
          FROM periodctlmst pra
         WHERE pra.remarks = 'AUDIT' AND pra.isclosed <> 0) pra
               ON v.parametercode = pra.groupcode,
       periodcontrol          pc
 WHERE     parametercode = 'GLB111'
       AND seqno IS NOT NULL
       AND LOWER (v.controlsystem) = LOWER (pc.SYSTEM)
ORDER BY seqno`


const detailQuery = `SELECT TO_CHAR (tdate, 'dd-mm-yyyy')
               "date",
       targettype
               "targettype",
       targetcode
               "targetcode",
       jobcode
               "activity",
       getjob_des (jobcode)
               "activity desc",
       referenceno
               "refference",
       purchaseitem
               "item",
       quantity
               "quantity",
       currid
               "currency",
       rate
               "rate",
       DECODE (
               SIGN (TVALUE),
               1, TRIM (
                          TO_CHAR (TVALUE,
                                   '999G999G999G999G999D99',
                                   'NLS_NUMERIC_CHARACTERS = ''.,''')))
               "debit",
       DECODE (
               SIGN (TVALUE),
               -1, TRIM (
                           TO_CHAR (TVALUE,
                                    '999G999G999G999G999D99',
                                    'NLS_NUMERIC_CHARACTERS = ''.,''')))
               "credit"
  FROM costbook
 WHERE     tdate BETWEEN TRUNC (TO_DATE ( :v_date, 'dd-mm-yyyy'), 'MONTH')
                     AND LAST_DAY (TO_DATE ( :v_date, 'dd-mm-yyyy'))
       AND (   ('GL' = :v_source AND referenceno LIKE 'CA%')
            OR ('GL' != :v_source AND SOURCETYPE = :v_source AND REFERENCENO NOT LIKE 'CA%'))
ORDER BY TDATE, REFERENCENO`


const fetchDataHeader = async function (users, params, routes, callback) {

        binds = {}

        console.log(params)

        //binds.search = (!params.search ? '' : params.search)
        //    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode)


        binds.limitsize = (!params.size ? 30 : params.size)
        binds.page = (!params.page ? 0 : params.page)
        binds.v_date = params.period
        //binds.search = (!params.search ? '' : params.search)
        //    binds.dateperiode = (!params.dateperiode ? '' : params.dateperiode

        let result

        //  console.log(baseQuery)

        try {
                //result = await database.siteWithDefExecute(users, routes, baseQuery, binds)
                result = await database.siteLimitExecute(users, routes, baseQuery, binds)



        } catch (error) {
                callback(error, '')
        }

        if (_.isEmpty(result)) {
                callback('', '')
        } else {
                callback('', result)
        }


}



const fetchDataView = async function (users, routes, params, callback) {

        binds = {}

        /**
         * ! change the parameters according to the table
         */



        binds.v_date = params.period
        binds.v_source = params.source

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
        fetchDataView
}
