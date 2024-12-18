const reason =` SELECT   PARAMETERVALUECODE "code" , PARAMETERVALUE  "description"
FROM   parameterVALUE
WHERE   PARAMETERCODE = 'VEH01' AND TO_CHAR(seq_no) <> '1' and parametervaluecode not in ('N/A','N/A ')
and (PARAMETERVALUECODE like upper ('%'||:0||'%') OR PARAMETERVALUE like upper ('%'||:0||'%'))
ORDER BY PARAMETERVALUECODE`

module.exports = reason