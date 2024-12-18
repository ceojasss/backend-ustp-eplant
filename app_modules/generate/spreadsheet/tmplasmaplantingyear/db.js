const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const firstStatement_Q1 = `
SELECT   fiscalyear, period, TO_CHAR (v.plantingdate, 'yyyy') plantingyear,stage, 
         a.accountcode, a.description, SUM (amount) amt
    FROM v_maturecost_plasma_detail v, job j, accountcode a, blockkelompoktani k, kelompoktani b
   WHERE fiscalyear = :P_YEAR
     AND period between :P_MONTH and :P_MONTH2
     AND v.jobcode = j.jobcode
     AND j.accountcode = a.accountcode
     and targetcode = fieldcode
     and kelompoktanicode = ktcode
     AND v.divisioncode = NVL (:P_DIV, v.divisioncode)
GROUP BY fiscalyear,
         period,
         stage,
         TO_CHAR (v.plantingdate, 'yyyy'),
         a.accountcode,
         a.description`

const firstStatement_Q2 = `
SELECT   SUM (amount)
FROM v_maturecost_plasma_detail v, job j, accountcode a
WHERE fiscalyear = :P_YEAR
 AND period between :P_MONTH and :P_MONTH2
 AND v.jobcode = j.jobcode
 AND j.accountcode = a.accountcode
 AND v.divisioncode = NVL (:P_DIV, v.divisioncode)
 AND v.jobcode <>'P092003'
`

const secondStatement_Q1 = `
SELECT fiscalyear,period,to_char(v.PLANTINGDATE,'yyyy')plantingyear,targetcode,j.jobcode,j.JOBDESCRIPTION,sum(amount) 
from v_maturecost_plasma_detail v, job j
where fiscalyear = :P_YEAR
and period between :P_MONTH and :P_MONTH2
and v.jobcode = j.jobcode 
and v.DIVISIONCODE  = nvl(:P_DIV, v.DIVISIONCODE)
group by fiscalyear,period,to_char(v.PLANTINGDATE,'yyyy'),targetcode,j.jobcode,j.jobDESCRIPTION 
order by to_char(v.PLANTINGDATE,'yyyy'),j.jobcode `

const secondStatement_Q2 = `
select to_char(plantingdate,'yyyy') as TahunTanam,sum(hectplanted) as Hectare, sum(totstandoffield) as StandOfField from fieldcrop
where inactivedate is null 
and to_char(plantingdate,'yyyy') in (select to_char(plantingdate,'yyyy') from v_maturecost_plasma_detail 
where period between :P_MONTH and :P_MONTH2
and fiscalyear=:P_YEAR)
and divisioncode  = nvl(:P_DIV, divisioncode)
group by to_char(plantingdate,'yyyy')
order by to_char(plantingdate,'yyyy')`


const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement,bindStatement,secondresult


    // console.log('find :', find.report);
    if (find.P_DIV === 'A'){
        _.set(find,'P_DIV','')
        bindStatement = _.pick(find, ['P_DIV', 'P_YEAR', 'P_MONTH', 'P_MONTH2'])
    } else {
        bindStatement = _.pick(find, ['P_DIV', 'P_YEAR', 'P_MONTH', 'P_MONTH2'])
    }

    try {
        if (find.report === 'rpt_cost_op_mature_sum_plasma.rdf') {
            result = await database.executeStmt(users, firstStatement_Q1, bindStatement);
            secondresult = await database.executeStmt(users, firstStatement_Q2, bindStatement)
        } else if (find.report === 'rpt_cost_op_mature_det_plasma.rdf') {
            result = await database.executeStmt(users, secondStatement_Q1, bindStatement);
            secondresult = await database.executeStmt(users, secondStatement_Q2, bindStatement)
        } else {
            throw new Error('Invalid report type');
        }

    } catch (errors) {
        error = errors;
    }

    callback(error, result, secondresult);
}

module.exports = {
    fetchDataDynamic
}