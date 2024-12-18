const Afdeling = ` SELECT distinct divisioncode "divisioncode", divisionname "divisionname"
FROM organization
WHERE functionCODE = 'E' 
AND INACTIVEDATE IS NULL
and departmentcode = :1 and ( (divisioncode) like upper ('%'||:0||'%') or (divisionname) like ('%'||:0||'%'))  
order by divisioncode `

module.exports = Afdeling