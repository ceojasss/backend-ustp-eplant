const Uom = `SELECT UNITOFMEASURECODE "code" ,UNITOFMEASUREDESC "description"
FROM UNITOFMEASURE
WHERE    ( upper(UNITOFMEASURECODE) like upper('%'||:0||'%') or UPPER (UNITOFMEASUREDESC) LIKE UPPER ('%'||:0||'%'))
     order by UNITOFMEASURECODE`

module.exports = Uom