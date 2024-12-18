const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')
const { query } = require('express')

const summarysheet1 = `SELECT   fiscalyear, period, TO_CHAR (v.plantingdate, 'yyyy') plantingyear,stage, 
a.accountcode, a.description, SUM (amount) amt
FROM v_maturecost_plasma_detail v, job j, accountcode a, blockkelompoktani k, kelompoktani b
WHERE fiscalyear = :p_year
AND period between :p_month and :p_month2
AND v.jobcode = j.jobcode
AND j.accountcode = a.accountcode
and targetcode = fieldcode
and kelompoktanicode = ktcode
AND v.divisioncode = NVL (:p_div, v.divisioncode)
GROUP BY fiscalyear,
period,
stage,
TO_CHAR (v.plantingdate, 'yyyy'),
a.accountcode,
a.description`

const summarysheet2 =`SELECT   SUM (amount)
FROM v_maturecost_plasma_detail v, job j, accountcode a
WHERE fiscalyear = :p_year
 AND period between :p_month and :p_month2
 AND v.jobcode = j.jobcode
 AND j.accountcode = a.accountcode
 AND v.divisioncode = NVL (:p_div, v.divisioncode)
 AND v.jobcode <>'P092003'`

 const detailsheet1=`SELECT fiscalyear,period,to_char(v.PLANTINGDATE,'yyyy')plantingyear,targetcode,j.jobcode,j.JOBDESCRIPTION,sum(amount) 
 from v_maturecost_plasma_detail v, job j
 where fiscalyear = :P_YEAR
 and period between :P_MONTH and :P_MONTH2
 and v.jobcode = j.jobcode 
 and v.DIVISIONCODE  = nvl(:P_DIV, v.DIVISIONCODE)
 group by fiscalyear,period,to_char(v.PLANTINGDATE,'yyyy'),targetcode,j.jobcode,j.jobDESCRIPTION 
 order by to_char(v.PLANTINGDATE,'yyyy'),j.jobcode`

 const detailsheet2=`select to_char(plantingdate,'yyyy') as TahunTanam,sum(hectplanted) as Hectare, sum(totstandoffield) as StandOfField from fieldcrop
 where inactivedate is null 
 and to_char(plantingdate,'yyyy') in (select to_char(plantingdate,'yyyy') from v_maturecost_plasma_detail 
 where period between :P_MONTH and :P_MONTH2
 and fiscalyear=:P_YEAR)
 AND divisioncode = NVL (:p_div, divisioncode)
 group by to_char(plantingdate,'yyyy')
 order by to_char(plantingdate,'yyyy')`



const fetchDataDynamic = async function (users, find, callback,) {
    let firstsheet,secondsheet, error, queryStatement1,queryStatement2,bindStatement


    // // custom code
    if (find.report === 'rpt_cost_op_mature_sum.rdf') {
        queryStatement1 = summarysheet1
        queryStatement2 = summarysheet2
        // querysum2 = summarysheet2
    } else {
        queryStatement1 = detailsheet1
        queryStatement2 = detailsheet2
    }



    if (find.P_DIV === 'A'){
        _.set(find,'P_DIV','')
        bindStatement = _.pick(find, ['P_DIV', 'P_YEAR', 'P_MONTH', 'P_MONTH2'])
    } else {
        bindStatement = _.pick(find, ['P_DIV', 'P_YEAR', 'P_MONTH', 'P_MONTH2'])
    }

    try {
        firstsheet = await database.executeStmt(users, queryStatement1,bindStatement)
        secondsheet = await database.executeStmt(users, queryStatement2,bindStatement)

    } catch (errors) {

        error = errors
    }

    // console.log("res1",firstsheet);
    // console.log("res2",secondsheet);

    callback(error, firstsheet,secondsheet)
}


module.exports = {
    fetchDataDynamic
}
