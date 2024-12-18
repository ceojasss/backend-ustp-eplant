const _ = require('lodash')
const database = require('../../../../oradb/dbHandler');
const OracleDB = require('oracledb');

const queryStatement = `SELECT module, referenceno, tanggal, locationtype, jobcode, description,
MONTH, YEAR
FROM temp_validasi_transaksi
WHERE MONTH = :P_MONTH AND YEAR = :P_YEAR AND module = NVL (:P_MODUL, module)`




const fetchDataDynamic = async function (users, find, callback) {

    let result, error, fillStatement

    fillStatement = `begin P_VALIDASITRANSAKSI ( :P_MODUL, :P_MONTH, :P_YEAR, :P_STATUS ); end;`

    let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_MODUL', 'P_STATUS' ])

     _.assignIn(bindsFills,{P_STATUS:{dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }})

    
    let bindStatement = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_MODUL'])
    

    try {
        result = await database.fetchFromTempData(users, fillStatement, queryStatement, bindsFills, bindStatement)

    } catch (errors) {

        error = errors
    }


    callback(error, result)
}


module.exports = {
    fetchDataDynamic
}
