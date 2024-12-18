const Department = `SELECT distinct departmentcode "departmentcode", departmentname "departmentname"
FROM organization
WHERE    ( upper(departmentcode) like upper('%'||:0||'%') or UPPER (departmentcode) LIKE UPPER ('%'||:0||'%'))
     order by departmentcode`

module.exports = Department