const SiteOnly = `SELECT PARAMETERVALUECODE "code",PARAMETERVALUECODE "description"
FROM parametervalue
WHERE PARAMETERCODE = 'HRM10'
AND PARAMETERVALUE NOT LIKE '%MILL%'
    and  PARAMETERVALUECODE like  ('%'||:0||'%')
    and parametervaluecode <> 'USTP'
    ORDER BY SEQ_NO`

module.exports = SiteOnly
