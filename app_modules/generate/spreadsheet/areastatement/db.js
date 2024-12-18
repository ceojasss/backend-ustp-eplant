const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const firstQuery = `select DIVISIONCODE,NOHGU,FIELDCODE,DESCRIPTION,HECTPLANTED,TO_CHAR(PLANTINGDATE,'YYYY')AS TAHUNTANAM,TOTSTANDOFFIELD AS POKOK,TOTALHECTARAGE,COSTCENTERID, decode(intiplasma,'0', 'PLASMA','INTI') intiplasma from fieldcrop
where inactivedate is null and divisioncode=:afd
order by divisioncode,fieldcode`

const secQuery=`select to_char(plantingdate,'yyyy') as TahunTanam,sum(hectplanted) as Hectare,sum(TOTSTANDOFFIELD) as JumlahPokok 
from fieldcrop
where inactivedate is null
and divisioncode=nvl(:afd,divisioncode)
group by to_char(plantingdate,'yyyy') 
order by to_char(plantingdate,'yyyy')`




const fetchDataDynamic = async function (users, find, callback) {
    let result, sec_result ,error, fillStatement

    // custom code
    // if (find.report === 'M') {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TMONTH ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // } else {
    //     fillStatement = `begin RPT_DETAIL_LEDGER_TODATE ( :P_MONTH, :P_YEAR, :P_JOBCODE1, :P_JOBCODE2 ); end;`
    // }


    // let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['afd'])

    try {
        result = await database.executeStmt(users, firstQuery, bindStatement)
        sec_result = await database.executeStmt(users, secQuery, bindStatement)


    } catch (errors) {

        error = errors
    }



    callback(error, result,sec_result)


}


module.exports = {
    fetchDataDynamic
}
