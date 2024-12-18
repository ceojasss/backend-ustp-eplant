const EmployeeCodeHO = `select empcode "code", empname "description", epms_ustp.get_empposname(empcode) "jabatan" from epms_ustp.empmasterepms
where DATETERMINATE is null 
and inactivedate is null and ((empcode like ('%'||:0||'%') 
or empname like UPPER ('%'||:0||'%') ) and length(:0) >= 3) order by empcode`

module.exports = EmployeeCodeHO
