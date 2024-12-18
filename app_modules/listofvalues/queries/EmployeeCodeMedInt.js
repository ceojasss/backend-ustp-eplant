const EmployeeCodeMedInt = ` select empcode , empname , employeetype,costcenter, familystatusrice 
from empmasterepms
where dateterminate is null 
and (empcode like ('%'||:0||'%') or 
empname like UPPER ('%'||:0||'%')) /* and rownum < 150  */
order by empcode`



module.exports = EmployeeCodeMedInt

