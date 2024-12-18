const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const firstStatement_Q1 = `
/* Formatted on 2017/01/17 14:51 (Formatter Plus v4.8.8) */
SELECT   fiscalyear, period, TO_CHAR (v.plantingdate, 'yyyy') plantingyear,
         j.jobcode || '    -        ' || j.jobdescription, v.targettype,
         SUM (amount)
    FROM v_immaturecost_plasma_detail v, job j
   WHERE fiscalyear = :P_YEAR
     AND period BETWEEN :P_MONTH AND :P_MONTH2 
     AND v.jobcode = j.jobcode
     AND v.divisioncode  = nvl(:P_DIV, v.divisioncode)
GROUP BY fiscalyear,
         period,
         TO_CHAR (v.plantingdate, 'yyyy'),
         j.jobcode,
         j.jobdescription,
         v.targettype
ORDER BY TO_CHAR (v.plantingdate, 'yyyy'), j.jobcode`

const firstStatement_Q2 = `
select sum(amount) from v_immaturecost_plasma_detail v
where fiscalyear = :P_YEAR
and period between  :P_MONTH and :P_MONTH2 and divisioncode  = nvl(:P_DIV, divisioncode)
`

const firstStatement_Q3 = `
select to_char(plantingdate,'yyyy') as TahunTanam,sum(hectplanted) as Hectare, sum(totstandoffield) as StandOfField from fieldcrop
where inactivedate is null 
and to_char(plantingdate,'yyyy') in (select to_char(plantingdate,'yyyy') from v_immaturecost_plasma_detail 
where period between :P_MONTH  and :P_MONTH2
and fiscalyear=:P_YEAR)
and divisioncode  = nvl(:P_DIV, divisioncode)
group by to_char(plantingdate,'yyyy')
order by to_char(plantingdate,'yyyy')
`

const secondStatement_Q1 = `
SELECT   fiscalyear, period, TO_CHAR (v.plantingdate, 'yyyy') plantingyear,
         j.jobcode || ' -     ' || j.jobdescription, v.targettype,
         SUM (amount)                  --, sum(tot_hect), sum(totstandoffield)
    FROM v_immaturecost_plasma_detail v, job j
   WHERE fiscalyear = :P_YEAR
     AND period BETWEEN :P_MONTH AND :P_MONTH2
     AND v.jobcode = j.jobcode
     AND v.divisioncode = NVL (:P_DIV, v.divisioncode)
GROUP BY fiscalyear,
         period,
         TO_CHAR (v.plantingdate, 'yyyy'),
         j.jobcode,
         j.jobdescription,
         v.targettype

`

const secondStatement_Q2 = `
select to_char(plantingdate,'yyyy') as TahunTanam,sum(hectplanted) as Hectare, sum(totstandoffield) as StandOfField from fieldcrop
where inactivedate is null 
and to_char(plantingdate,'yyyy') in (select to_char(plantingdate,'yyyy') from v_immaturecost_plasma_detail 
where period between :P_MONTH and  :P_MONTH2
and fiscalyear=:P_YEAR)
and divisioncode  = nvl(:P_DIV, divisioncode)
group by to_char(plantingdate,'yyyy')
order by to_char(plantingdate,'yyyy')`

const thirdStatement_01 = `/* Formatted on 2016/01/13 09:27 (Formatter Plus v4.8.8) */
SELECT   fiscalyear, period, targetcode,
         TO_CHAR (v.plantingdate, 'yyyy') plantingyear,
         j.jobcode || ' -     ' || j.jobdescription, v.targettype,
         SUM (amount)                  --, sum(tot_hect), sum(totstandoffield)
    FROM v_immaturecost_plasma_detail v, job j
   WHERE fiscalyear = :P_YEAR
     AND period BETWEEN :P_MONTH AND :P_MONTH2
     AND v.jobcode = j.jobcode
     AND v.divisioncode = NVL (:P_DIV, v.divisioncode)
GROUP BY fiscalyear,
         period,
         TO_CHAR (v.plantingdate, 'yyyy'),
         j.jobcode,
         j.jobdescription,
         targetcode,
         v.targettype`

const thirdStatement_02 = `select to_char(plantingdate,'yyyy') as TahunTanam,sum(hectplanted) as Hectare, sum(totstandoffield) as StandOfField from fieldcrop
where inactivedate is null 
and to_char(plantingdate,'yyyy') in (select to_char(plantingdate,'yyyy') from v_immaturecost_plasma_detail 
where period between :P_MONTH and  :P_MONTH2
and fiscalyear=:P_YEAR)
and divisioncode  = nvl(:P_DIV, divisioncode)
group by to_char(plantingdate,'yyyy')
order by to_char(plantingdate,'yyyy')`


const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement


    // console.log('find :', find.report);

    let bindStatement = _.pick(find, ['P_DIV', 'P_YEAR', 'P_MONTH', 'P_MONTH2'])

    try {
        if (find.report === 'rpt_cost_op_immature_plasma.rdf') {
            result = await database.executeStmt(users, firstStatement_Q1, bindStatement);
            secondresult = await database.executeStmt(users, firstStatement_Q2, bindStatement)
            thirdresult = await database.executeStmt(users, firstStatement_Q3, bindStatement)
        } else if (find.report === 'rpt_cost_op_immature_det_plasma.rdf') {
            result = await database.executeStmt(users, secondStatement_Q1, bindStatement);
            secondresult = await database.executeStmt(users, secondStatement_Q2, bindStatement)
        } else if(find.report === 'rpt_cost_op_immature_det_block_plasma.rdf') {
            result = await database.executeStmt(users, thirdStatement_01, bindStatement);
            secondresult = await database.executeStmt(users, thirdStatement_02, bindStatement)
        }else {
            throw new Error('Invalid report type');
        }
 
    } catch (errors) {
        error = errors;
    }

    callback(error, result, secondresult, thirdresult);
}

module.exports = {
    fetchDataDynamic
}