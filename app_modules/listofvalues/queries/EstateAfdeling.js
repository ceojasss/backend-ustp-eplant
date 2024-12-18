const EstAfd = `SELECT distinct DEPARTMENTCODE "kebun",divisioncode "afdeling"
FROM organization
WHERE functionCODE = 'E' AND INACTIVEDATE IS NULL
and assign_to = 'KEBUN'
and ( upper(DEPARTMENTCODE) like '%'||:0||'%' or upper(DEPARTMENTNAME) like '%'||:0||'%')  
order by departmentcode
`

module.exports = EstAfd