const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const firstStatement = `
SELECT 
MONTH, YEAR, NO, 
   DESCRIPTION, ((ACT_TM * VIEW_FACTOR) ) ACT_TM, (EST_TM ) EST_TM, 
   PCT_TM, ((ACT_TD * VIEW_FACTOR))  ACT_TD, (EST_TD ) EST_TD, 
   PCT_TD, ACT_LY, LINETYPE, 
   VIEW_FACTOR
FROM RPT_EXE_SUM_PROFIT_LOSS_HIST
WHERE MONTH = :P_MONTH AND YEAR = :P_YEAR ORDER BY NO`

const secondStatement = `
--SELECT * FROM			 
--(	
    SELECT  '1' X,NO,LINE_DESCRIPTION,ACCOUNTCODE,ACCOUNT_DESCRIPTION,
    SUM(ACT_TM*VIEW_FACTOR) ACT_TM, SUM(EST_TM*VIEW_FACTOR) EST_TM,
    SUM(ACT_TD*VIEW_FACTOR) ACT_TD, SUM(EST_TD*VIEW_FACTOR) EST_TD    
    --SUM(ACT_TD*VIEW_FACTOR)AMOUNT
	FROM RPT_EXE_SUM_PROFIT_LOSS_DETAIL 
    WHERE MONTH = :P_MONTH
    AND YEAR = :P_YEAR    
    GROUP BY NO,LINE_DESCRIPTION,ACCOUNTCODE,ACCOUNT_DESCRIPTION    
    UNION ALL
    SELECT '2' X, NO,DESCRIPTION,NULL,NULL,
    (ACT_TM * VIEW_FACTOR) ACT_TM, (EST_TM * VIEW_FACTOR) EST_TM,
    (ACT_TD * VIEW_FACTOR) ACT_TD, (EST_TD * VIEW_FACTOR) EST_TD
    --(ACT_TD * VIEW_FACTOR) ACT_TD
    FROM RPT_EXE_SUM_PROFIT_LOSS_HIST
    WHERE MONTH = :P_MONTH
    AND YEAR = :P_YEAR   
--)
ORDER BY NO,X,ACCOUNTCODE`

const thirdStatement = `
/* Formatted on 21/01/2021 18:53:16 (QP5 v5.115.810.9015) */
SELECT   MONTH,
         YEAR,
         NO,
         DESCRIPTION,
         ( (ACT_TM * VIEW_FACTOR)) ACT_TM,
         (EST_TM) EST_TM,
         PCT_TM,
         ( (ACT_TD * VIEW_FACTOR)) ACT_TD,
         (EST_TD) EST_TD,
         PCT_TD,
         ACT_LY,
         LINETYPE,
         VIEW_FACTOR,
         0 var
  FROM   RPT_EXE_SUM_PROFIT_LOSS_HIST
 WHERE   MONTH = :P_MONTH AND YEAR = :P_YEAR AND no NOT BETWEEN 290 AND 530
UNION ALL
SELECT   MONTH,
         YEAR,
         NO,
         DESCRIPTION,
         ( (ACT_TM * VIEW_FACTOR)) ACT_TM,
         (EST_TM) EST_TM,
         PCT_TM,
         ( (ACT_TD * VIEW_FACTOR)) ACT_TD,
         (EST_TD) EST_TD,
         PCT_TD,
         ACT_LY,
         LINETYPE,
         VIEW_FACTOR,
         (SELECT   SUM (var)
            FROM   (SELECT   act_td * -1 var
                      FROM   RPT_EXE_SUM_PROFIT_LOSS_HIST
                     WHERE   MONTH = :P_MONTH AND YEAR = :P_YEAR AND no = 530
                    UNION ALL
                    SELECT   (ACT_TD) var
                      FROM   RPT_EXE_SUM_PROFIT_LOSS_COGS
                     WHERE   MONTH = :P_MONTH AND YEAR = :P_YEAR))
            var
  FROM   RPT_EXE_SUM_PROFIT_LOSS_HIST
 WHERE   MONTH = :P_MONTH AND YEAR = :P_YEAR AND no = 530
UNION ALL
SELECT   MONTH,
         YEAR,
         NO,
         LINE_DESCRIPTION,
         ( (ACT_TM) * -1) ACT_TM,
         (EST_TM) EST_TM,
         PCT_TM,
         ( (ACT_TD) * -1) ACT_TD,
         (EST_TD) EST_TD,
         PCT_TD,
         ACT_LY * -1 ,
         'D' LINETYPE,
         VIEW_FACTOR,
         0 var
  FROM   RPT_EXE_SUM_PROFIT_LOSS_COGS
 WHERE   MONTH = :P_MONTH AND YEAR = :P_YEAR
ORDER BY   NO`




const fetchDataDynamic = async function (users, find, callback) {
    let result, error, fillStatement


    // console.log('find :', find.report);

    let bindStatement = _.pick(find, ['P_YEAR', 'P_MONTH'])
    
    try {
        if (find.report === 'RPT_EIS_PROFIT_LOSS.rdf') {
            result = await database.executeStmt(users, firstStatement, bindStatement);
        } else if(find.report === 'rpt_gl_profit_lost_detail.rdf'){
            result = await database.executeStmt(users, secondStatement, bindStatement);
        } else if(find.report === 'RPT_EIS_PROFIT_LOSS_COGS.rdf'){
            result = await database.executeStmt(users, thirdStatement, bindStatement);
        } else {
            throw new Error('Invalid report type');
        }
    } catch (errors) {
        error = errors;
    }
    
    callback(error, result);
}

module.exports = {
    fetchDataDynamic
}