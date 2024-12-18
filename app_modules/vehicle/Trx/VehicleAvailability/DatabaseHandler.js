const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

/**
 * ! change query table header
 */
const baseQuery = `select  TO_CHAR (tdate, 'dd-mm-yyyy') "tdate" from Vehicleavailability_new where 
(tdate LIKE '%' ||  :search || '%')
                 AND 
                  to_char(tdate,'mmyyyy') = nvl(to_char(TO_DATE(:dateperiode, 'MM/YYYY'),'mmyyyy'),to_char(tdate,'mmyyyy')) group by tdate order by tdate `

/**
 * ! change query table detail
 */
const detailQuery = `  select v.rowid "rowid", 
v.tid "tid",v.vehiclecode "vehiclecode",get_vehiclename(vehiclecode) "descriptiondisplayonly", v.vehiclegroupcode "vehiclegroupcode",v.vehiclegroupcode "vehiclegroupcode1displayonly",jam_ops "jam_ops", jam_breakdown "jam_breakdown", jam_standby "jam_standby",reason_standby "reason_standby",reason_breakdown "reason_breakdown",
 /*reason "reason#code",p.parametervalue "reason#description",*/v.inputby "inputby", to_char (tdate, 'dd-mm-yyyy') "tdate",CASE
        WHEN lokasi = 'M' THEN 'PKS'
        ELSE 'KEBUN'
    END "vehiclegroupcode2displayonly",
to_char(v.inputdate, 'dd-mm-yyyy hh24:mi') "inputdate", v.updateby "updateby", to_char(v.updatedate, 'dd-mm-yyyy hh24:mi') "updatedate" from Vehicleavailability_new v/*, vehicle vh */
where /*vh.vehiclecode = v.vehiclecode and*/ to_char (tdate, 'ddmmyyyy') = NVL (TO_CHAR (TO_DATE ( :period, 'DD/MM/YYYY'), 'ddmmyyyy'),
TO_CHAR (tdate, 'ddmmyyyy'))  order by vehiclecode
`



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
    binds.period = (!params.period ? '' : params.period)

    let result

    try {
        result = await database.siteWithDefExecute(users, routes, detailQuery, binds)


    } catch (error) {
        callback(error, '')
    }



    callback('', result)
}


const generateVH = async function (users, params) {
    return new Promise(async (resolve, reject) => {

        binds = {}
        
        // console.log(params)
        /**
       * ! change the parameters according to the table
       */
        binds.tdate = (!params.tdate ? '' : params.tdate)
        // binds.vh = { dir: oracledb.BIND_OUT, type: oracledb.STRING }

        let result


        //    (users, statement, binds, opts = {})
        try {

            const stmt = `BEGIN 
         INIT_VH_AVAILABILITY (TO_DATE(:tdate,'DD/MM/YYYY'));
         END ; `
        //  BEGIN AUTO_EMAIL_SPD_ONE('$KEYSPD','$IDSPD',NULL); END;

            result = await database.siteExecuteDynamicBinds(users, stmt, binds)

        } catch (error) {
            reject(error)
        }

        resolve(result)
    })
}

module.exports = {
    fetchDataHeader,
    fetchDataDetail,
    generateVH
}
