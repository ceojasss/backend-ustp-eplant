const Employeebiodata = `select empcode "code", empname "description" from empmasterepms
where employeetype='PHL' and (empcode like ('%'||:0||'%') or empname like UPPER ('%'||:0||'%')) and rownum < 100 order by empcode`

module.exports = Employeebiodata
