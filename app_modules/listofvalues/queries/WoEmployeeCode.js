const WoEmployeeCode = `select empcode "code", empname "description" from empmasterepms
where DATETERMINATE is null 
and inactivedate is null and ((empcode like ('%'||:0||'%') 
or empname like UPPER ('%'||:0||'%') ) and length(:0) >= 3 and length(id_position) = 5 and  id_position like '2%') order by empcode`

module.exports = WoEmployeeCode
