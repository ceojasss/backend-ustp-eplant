const _ = require('lodash')
const oracledb = require('oracledb')
const database = require('../../../../oradb/dbHandler')

const baseQuery = `select rowid "rowid",AGREEMENTCODE "agreementcode", to_char(AGREEMENTDATE, 'dd-mm-yyyy') "agreementdate", SUPPLIERCODE "suppliercode#code",
get_suppliername(suppliercode) "suppliercode#description",remarks "remarks",pocode "pocode",process_flag1 "process_flag1", process_flag2 "process_flag2",
to_char(STARTDATE, 'dd-mm-yyyy') "startdate", to_char(ENDDATE, 'dd-mm-yyyy') "enddate", INPUTBY "inputby", to_char(INPUTDATE, 'dd-mm-yyyy hh24:mi') "inputdate",
UPDATEBY "updateby", to_char(UPDATEDATE, 'dd-mm-yyyy hh24:mi') "updatedate" from lpocontract 
where (AGREEMENTCODE LIKE  UPPER('%' || :search ||'%') OR SUPPLIERCODE LIKE  UPPER('%' || :search ||'%'))
  AND TO_CHAR (AGREEMENTDATE, 'mmyyyy') =
  decode(:search,null,TO_CHAR (TO_DATE (:dateperiode, 'MM/YYYY'), 'mmyyyy'),
  TO_CHAR (AGREEMENTDATE, 'mmyyyy'))
order by agreementcode`





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



const runApprove = async function (users, params) {

    binds = {
        // agreementcode: params.agreementcode,
        // rid: {
        //     type: oracledb.STRING,
        //     dir: oracledb.BIND_OUT
        // }
    }

// console.log(params)
    binds.agreementcode = (!params.agreementcode ? '' : params.agreementcode)
    binds
    let result
    let statement = `BEGIN  
    approve_pocon_p (:agreementcode);  
     END;`
    // console.log(binds)
    try {
        result = await database.execFunc(users, statement, binds)

        // console.log(result)
    } catch (error) {
        return result
    }



    return result
}


module.exports = {
    fetchDataHeader,
    runApprove
}


