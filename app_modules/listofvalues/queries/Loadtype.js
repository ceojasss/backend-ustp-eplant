const Loadtype = `SELECT LOADTYPECODE "code",DESCRIPTION "description" 
FROM LOADTYPE
where INACTIVEDATE is null and  ( upper(LOADTYPECODE) like upper('%'||:0||'%')  or UPPER (DESCRIPTION) LIKE UPPER ('%'||:0||'%') )`

module.exports = Loadtype