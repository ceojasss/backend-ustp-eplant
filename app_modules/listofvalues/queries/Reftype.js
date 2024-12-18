const Reftype = `SELECT distinct reftype "reftype"
FROM parameterrate
WHERE    ( upper(reftype) like upper('%'||:0||'%') or UPPER (reftype) LIKE UPPER ('%'||:0||'%'))
     order by reftype`

module.exports = Reftype