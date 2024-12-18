const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const summaryStatement = `SELECT   fiscalyear, period, TO_CHAR (v.plantingdate, 'yyyy') plantingyear,
j.jobcode || '    -        ' || j.jobdescription, v.targettype,
SUM (amount)
FROM v_immaturecost_detail v, job j
WHERE fiscalyear = :P_YEAR
AND v.divisioncode = NVL (:P_DIV, v.divisioncode)
AND period BETWEEN :P_MONTH AND :P_MONTH2
AND v.jobcode = j.jobcode
GROUP BY fiscalyear,
period,
TO_CHAR (v.plantingdate, 'yyyy'),
j.jobcode,
j.jobdescription,
v.targettype
ORDER BY TO_CHAR (v.plantingdate, 'yyyy'), j.jobcode`

const summaryStatement2 = `select sum(amount) from v_immaturecost_detail v
where fiscalyear = :P_YEAR
AND divisioncode = NVL (:P_DIV, divisioncode)
and period between  :P_MONTH and :P_MONTH2`

const summaryStatement3 = `select to_char(plantingdate,'yyyy') as TahunTanam,sum(hectplanted) as Hectare, sum(totstandoffield) as StandOfField from fieldcrop
where inactivedate is null 
and to_char(plantingdate,'yyyy') in (select to_char(plantingdate,'yyyy') from v_immaturecost_detail 
where period between :P_MONTH  and :P_MONTH2
AND divisioncode = NVL (:P_DIV, divisioncode)
and fiscalyear=:P_YEAR)
group by to_char(plantingdate,'yyyy')
order by to_char(plantingdate,'yyyy')`

const detailStatement = `SELECT   fiscalyear, period, TO_CHAR (v.plantingdate, 'yyyy') plantingyear,
j.jobcode || ' -     ' || j.jobdescription, v.targettype,
SUM (amount)                  --, sum(tot_hect), sum(totstandoffield)
FROM v_immaturecost_plasma_detail v, job j
WHERE fiscalyear = :P_YEAR
AND v.divisioncode = NVL (:P_DIV, v.divisioncode)
AND period BETWEEN :P_MONTH AND :P_MONTH2
AND v.jobcode = j.jobcode
GROUP BY fiscalyear,
period,
TO_CHAR (v.plantingdate, 'yyyy'),
j.jobcode,
j.jobdescription,
v.targettype`

const detailStatement2 = `select to_char(plantingdate,'yyyy') as TahunTanam,sum(hectplanted) as Hectare, sum(totstandoffield) as StandOfField from fieldcrop
where inactivedate is null 
and to_char(plantingdate,'yyyy') in (select to_char(plantingdate,'yyyy') from v_immaturecost_detail 
where fiscalyear=:P_YEAR)
AND divisioncode = NVL (:P_DIV, divisioncode)
and period between :P_MONTH and  :P_MONTH2
group by to_char(plantingdate,'yyyy')
order by to_char(plantingdate,'yyyy')
`

const detailblockStatement = `SELECT   fiscalyear, period, targetcode,
TO_CHAR (v.plantingdate, 'yyyy') plantingyear,
j.jobcode || ' -     ' || j.jobdescription, v.targettype,
SUM (amount)
FROM v_immaturecost_detail v, job j
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

const detailblockStatement2 = `select to_char(plantingdate,'yyyy') as TahunTanam,sum(hectplanted) as Hectare, sum(totstandoffield) as StandOfField from fieldcrop
where inactivedate is null 
and to_char(plantingdate,'yyyy') in (select to_char(plantingdate,'yyyy') from v_immaturecost_detail 
where period between :P_MONTH and  :P_MONTH2
AND divisioncode = NVL (:P_DIV, divisioncode)
and fiscalyear=:P_YEAR)
group by to_char(plantingdate,'yyyy')
order by to_char(plantingdate,'yyyy')`




const fetchDataDynamic = async function (users, find, callback) {
    //let summaryResult, summaryResult2, summaryResult3, detResult, detResult2, detblock, detblock2, fillsummaryStatement, fillsummaryStatement2, fillsummaryStatement3, filldetStatement, filldetStatement2, filldetblockStatement, filldetblockStatement2
    let firstSheet, secondSheet, thirdSheet, error, queryStatement1,  queryStatement2,  queryStatement3, bindStatement
    // custom code
    if (find.report === 'rpt_cost_op_immature_sum.rdf') {
        queryStatement1 = summaryStatement
        queryStatement2 = summaryStatement2
        queryStatement3 = summaryStatement3
    } else if (find.report === 'rpt_cost_op_immature_det.rdf') {
        queryStatement1 = detailStatement
        queryStatement2 = detailStatement2
    } else if (find.report === 'rpt_cost_op_immature_det_block.rdf'){
        queryStatement1 = detailblockStatement
        queryStatement2 = detailblockStatement2
    }
    // if (find.report === 'rpt_cost_op_immature_sum.rdf') {
    //     fillsummaryStatement = summaryStatement
    //     fillsummaryStatement2 = summaryStatement2
    //     fillsummaryStatement3 = summaryStatement3
    // } else if (find.report === 'rpt_cost_op_immature_det.rdf') {
    //     filldetStatement = detailStatement
    //     filldetStatement2 = detailStatement2
    // } else if (find.report === 'rpt_cost_op_immature_det_block.rdf'){
    //     filldetblockStatement = detailblockStatement
    //     filldetblockStatement2 = detailblockStatement2
    // }

    //let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    if (find.report === 'rpt_cost_op_immature_det_block.rdf'){
        _.set(find,'P_DIV','')
        // console.log(find)
        bindStatement = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_MONTH2'])
    } else {
        bindStatement = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_MONTH2', 'P_DIV'])
    }

    try {
        // firstSheet = await database.executeStmt(users, queryStatement1, bindStatement2)
        // secondSheet = await database.executeStmt(users, queryStatement2, bindStatement2)
        // thirdSheet = await database.executeStmt(users, queryStatement3, bindStatement2)
        if (find.report === 'rpt_cost_op_immature_sum.rdf') {
        firstSheet = await database.executeStmt(users, queryStatement1, bindStatement)
        secondSheet = await database.executeStmt(users, queryStatement2, bindStatement)
        thirdSheet = await database.executeStmt(users, queryStatement3, bindStatement)
        }
        else if (find.report === 'rpt_cost_op_immature_det.rdf') {
        firstSheet = await database.executeStmt(users, queryStatement1, bindStatement)
        secondSheet = await database.executeStmt(users, queryStatement2, bindStatement)

        }
        else if (find.report === 'rpt_cost_op_immature_det_block.rdf') {
        firstSheet = await database.executeStmt(users, queryStatement1, bindStatement)
        secondSheet = await database.executeStmt(users, queryStatement2, bindStatement)
        // thirdSheet = await database.executeStmt(users, queryStatement3, bindStatement)
        }
    } catch (errors) {

        error = errors
    }
    // console.log('Result1',firstSheet);
    // console.log('Result2',secondSheet);
    // console.log('Result3',thirdSheet);


    //callback(error, summaryResult, summaryResult2, summaryResult3, detResult, detResult2, detblock, detblock2)
    callback(error, firstSheet, secondSheet, thirdSheet)
}


module.exports = {
    fetchDataDynamic
}
