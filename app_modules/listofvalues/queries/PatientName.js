const Patient = `SELECT RELATION_ID                                         "relation_id",
family_name                                         "family_name",
DECODE (SEX, 0, 'L', 'P')                           "jk",
hitung_umur_detail (BIRTH_DATE, TO_DATE(:2,'dd-mm-yyyy')) "date_of_birth",
get_parametervalue ('HR', 'HRM05', RELATION_ID)     "status"
--,NIK_STAFF "empcode"
FROM hr_family
WHERE     nik_staff = :1
AND (   empcode LIKE UPPER ('%' || :0 || '%')
     OR RELATION_ID LIKE UPPER ('%' || :0 || '%')
     OR family_name LIKE UPPER ('%' || :0 || '%'))
UNION ALL
SELECT '0',
empname,
DECODE (SEX, 0, 'L', 'P')     "jk",
hitung_umur_detail (DOB, TO_DATE(:2,'dd-mm-yyyy')) "date_of_birth",
'-'
--, empcode "empcode"
FROM empmasterepms
WHERE     empcode = :1
AND (   empcode LIKE UPPER ('%' || :0 || '%')
     OR empname LIKE UPPER ('%' || :0 || '%'))
ORDER BY "relation_id"`

module.exports = Patient