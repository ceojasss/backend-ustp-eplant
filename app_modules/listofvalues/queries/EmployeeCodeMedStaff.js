const EmployeeCodeMedStaff = `  SELECT e.empcode "empcode",
e.empname "empname",
e.employeetype "employeetype" ,
CASE WHEN E.OTHERNAME = 'HO' THEN e.costcenter ELSE M.GROUPCODE END "location",
e.familystatusrice "status",
m.groupcode "groupcode"
FROM empmasterepms e, mas_position m, group_position g
WHERE     e.id_position = m.code
and g.groupcode = m.groupcode
and ( ( :1 = 'USTP' AND e.othername = 'HO' ) OR ( :1 != 'USTP' AND m.groupcode LIKE '%'||:1||'%' ))
AND e.dateterminate IS NULL
AND (   e.empcode LIKE ('%' || :0 || '%')
     OR e.empname LIKE UPPER ('%' || :0 || '%')) /* and rownum < 150  */
ORDER BY e.empcode`



module.exports = EmployeeCodeMedStaff

