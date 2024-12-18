const Site = `SELECT PARAMETERVALUECODE "code",PARAMETERVALUECODE "description", 'p_comp' "param",
'USTP' "defaultvalue"
FROM parametervalue
WHERE PARAMETERCODE = 'HRM10'
AND PARAMETERVALUE NOT LIKE '%MILL%'
    and  PARAMETERVALUECODE like  ('%'||:0||'%')
    ORDER BY SEQ_NO`

module.exports = Site
