const afdelingnp = `select divisioncode "code" ,divisionname "description" from organization 
WHERE ( upper(divisioncode) like upper('%'||:0||'%') or UPPER (divisionname) LIKE UPPER ('%'||:0||'%'))
group by divisioncode,divisionname
order by divisioncode`

module.exports = afdelingnp
