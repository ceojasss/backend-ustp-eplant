const _ = require('lodash')
const database = require('../../../../oradb/dbHandler')

const generalStatement = `  SELECT
CASE WHEN SUBSTR(TYPE,1,1) = 'H' AND SUBSTR(TYPE,2,1) = '0' THEN
	 description	
	 WHEN SUBSTR(TYPE,1,1) = 'H' AND SUBSTR(TYPE,2,1) = '1' THEN
	 '    '||description	
	 WHEN SUBSTR(TYPE,1,1) = 'T' AND SUBSTR(TYPE,2,1) = '0' THEN
	 description	
	 WHEN SUBSTR(TYPE,1,1) = 'T' AND SUBSTR(TYPE,2,1) = '1' THEN
	 '    '||description
	 ELSE
	 '        '||description	
END DESCRIPTION,
BGDB,BGCR,CURDB,CURCR,ENDDB,ENDCR,TYPE
FROM BALANCESHEETBSPACCHIST
WHERE MONTH=:PMONTH
AND YEAR =:PYEAR
ORDER BY LINENO`

const detailStatement =`SELECT X,
case when x= '2' and enddb is null and endcr is null then
    'H'
when  x != '2'  then
   'D'
else
   'T'
end ststus,LINENO,CASE WHEN SUBSTR(TYPE,1,1) = 'H' AND SUBSTR(TYPE,2,1) = '0' THEN
   description	
   WHEN SUBSTR(TYPE,1,1) = 'H' AND SUBSTR(TYPE,2,1) = '1' THEN
   '    '||description	
   WHEN SUBSTR(TYPE,1,1) = 'T' AND SUBSTR(TYPE,2,1) = '0' THEN
   description	
   WHEN SUBSTR(TYPE,1,1) = 'T' AND SUBSTR(TYPE,2,1) = '1' THEN
   '    '||description
   ELSE
   '        '||description	
END DESCRIPTION,ACCOUNTCODE,ACCOUNTDESC
  ,BGDB,BGCR,CURDB,CURCR,ENDDB,ENDCR,type FROM
(	SELECT  '1' X,LINENO,DESCRIPTION,ACCOUNTCODE,ACCOUNTDESC
  ,SUM(BGDB)BGDB,SUM(BGCR)BGCR,SUM(CURDB)CURDB,SUM(CURCR)CURCR,SUM(ENDDB)ENDDB,SUM(ENDCR)ENDCR, type
  FROM BALANCESHEETBSPACCHISTDET
  WHERE MONTH = :PMONTH
  AND YEAR = :PYEAR
  GROUP BY LINENO,DESCRIPTION,ACCOUNTCODE,ACCOUNTDESC,type
  UNION ALL
  SELECT '2' X, LINENO,DESCRIPTION,NULL,NULL
  ,SUM(BGDB)BGDB,SUM(BGCR)BGCR,SUM(CURDB)CURDB,SUM(CURCR)CURCR,SUM(ENDDB)ENDDB,SUM(ENDCR)ENDCR,type
  FROM BALANCESHEETBSPACCHIST
  WHERE MONTH = :PMONTH
  AND YEAR = :PYEAR
  GROUP BY LINENO,DESCRIPTION,type
)
ORDER BY LINENO,X,ACCOUNTCODE`




const fetchDataDynamic = async function (users, find, callback,) {
    let result, error, queryStatement


    // custom code
    if (find.report === 'RPT_GL_BALANCE_SHEET.rdf') {
        queryStatement = generalStatement
    } else {
        queryStatement = detailStatement
    }


    // let bindsFills = _.pick(find, ['P_MONTH', 'P_YEAR', 'P_JOBCODE1', 'P_JOBCODE2'])
    let bindStatement = _.pick(find, ['PYEAR', 'PMONTH', 'P_TARGETTYPE', 'P_TARGETCODE'])

    try {
        result = await database.executeStmt(users, queryStatement,bindStatement)

    } catch (errors) {

        error = errors
    }

   

    callback(error, result)
}


module.exports = {
    fetchDataDynamic
}
