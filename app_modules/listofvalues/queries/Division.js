const Division = `SELECT distinct divisioncode "divisioncode", divisionname "divisionname"
FROM organization
WHERE    ( upper(divisioncode) like upper('%'||:0||'%') or UPPER (divisioncode) LIKE UPPER ('%'||:0||'%'))
     order by divisioncode`

module.exports = Division