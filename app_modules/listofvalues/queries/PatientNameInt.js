const Patient = `SELECT 
family_name                                         "family_name",
RELATION_ID                                         "relation_id",
DECODE (SEX, 0, 'L', 'P')                           "jk",
get_parametervalue ('HR', 'HRM05', RELATION_ID)     "status"
--,NIK_STAFF "empcode"
FROM hr_family
WHERE     nik_staff = :1
AND (   empcode LIKE UPPER ('%' || :0 || '%')
     OR RELATION_ID LIKE UPPER ('%' || :0 || '%')
     OR family_name LIKE UPPER ('%' || :0 || '%'))
UNION ALL
SELECT 
empname,
'0',
DECODE (SEX, 0, 'L', 'P')     "jk",
'-'
--, empcode "empcode"
FROM empmasterepms
WHERE     empcode = :1
AND (   empcode LIKE UPPER ('%' || :0 || '%')
     OR empname LIKE UPPER ('%' || :0 || '%'))
ORDER BY "relation_id"`

module.exports = Patient