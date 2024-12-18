const Diagnosis = `SELECT   REF_CODE "code", REF_NAME "description"
FROM   (  SELECT   ref_code, ref_name FROM hr_ref_disease
        MINUS
        SELECT   ref_code, ref_name
          FROM   hr_ref_disease
         WHERE   ref_code IN (:0))  
where ( upper(REF_CODE) like upper('%'||:0||'%') or UPPER (REF_NAME) LIKE UPPER ('%'||:0||'%'))
 order by ref_code
`

module.exports = Diagnosis