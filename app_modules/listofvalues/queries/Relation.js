const Relation =`SELECT   NIK_STAFF "empcode",
RELATION_ID "relaion_id",
DECODE (SEX, 0, 'L', 'P') "jk",
family_name "family_name",
get_parametervalue ('HR', 'HRM05', RELATION_ID) "status"
FROM   hr_family
where nik_staff = :1 and (empcode like upper ('%'||:0||'%') or RELATION_ID like upper ('%'||:0||'%') or family_name like upper ('%'||:0||'%'))
union all
select empcode "empcode",'0',DECODE (SEX, 0, 'L', 'P') "jk",empname ,'-' from empmasterepms
where empcode  =  :1 and (empcode like upper ('%'||:0||'%') or empname like upper ('%'||:0||'%')) 
ORDER BY   NIK_STAFF, RELATION_ID`

module.exports = Relation