const EmployeeType = `SELECT distinct employeetype "code" 
FROM empmasterepms
WHERE    ( upper(employeetype) like upper('%'||:0||'%') or UPPER (employeetype) LIKE UPPER ('%'||:0||'%'))
     order by employeetype`

module.exports = EmployeeType