const Estate = `SELECT distinct DEPARTMENTCODE "departmentcode", DEPARTMENTNAME "departmentname"
FROM organization
WHERE functionCODE = 'E' AND INACTIVEDATE IS NULL
and ( DEPARTMENTCODE like upper ('%'||:0||'%') or DEPARTMENTNAME like ('%'||:0||'%'))  
order by departmentcode`

module.exports = Estate