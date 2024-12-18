const Lpo = `SELECT POCODE "code" ,l.suppliercode "description",s.suppliername "suppliername", to_char(podate, 'dd-mm-yyyy') "podate"
FROM LPO l, supplier s
WHERE    ( upper(POCODE) like upper('%'||:0||'%') or UPPER (l.REMARKS) LIKE UPPER ('%'||:0||'%')) and l.suppliercode = s.suppliercode and rownum < 50
     order by pocode`

module.exports = Lpo