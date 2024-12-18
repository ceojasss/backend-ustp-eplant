const EmployeePosition = `select empcode "code", empname "description",get_empposname(empcode) "position" from empmasterepms
where DATETERMINATE is null and inactivedate is null and empcode like ('%'||:0||'%') or empname like UPPER ('%'||:0||'%') order by empcode`

module.exports = EmployeePosition
