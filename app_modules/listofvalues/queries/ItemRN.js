const Itemrn = `SELECT  x.polineno "code", x.purchaseitemcode "itemcode",x.itemdescription "description", 
x.locationtype "locationtype", x.locationcode "locationcode", x.jobcode "jobcode",
nvl(x.qty,0) - nvl(y.qty,0) "quantity",x.polineno "poline"
FROM (SELECT   a.receivenotecode, b.polineno, b.purchaseitemcode,b.itemdescription,
b.locationtype, b.locationcode, b.jobcode,
SUM (b.quantity) qty
FROM receivenote a, receivenotedetail b
WHERE a.receivenotecode = b.receivenotecode
GROUP BY a.receivenotecode,
b.polineno,
b.purchaseitemcode,
b.itemdescription,
b.locationtype,
b.locationcode,
b.jobcode) x,
(SELECT   a.receivenotenumber, b.polineno, b.itemcode,
b.locationtype, b.locationcode, b.jobcode,
SUM (b.qtyreturn) qty
FROM returnnote a, returnnotedetail b
WHERE a.returnnotenumber = b.returnnotenumber
GROUP BY a.receivenotenumber,
b.polineno,
b.itemcode,
b.locationtype,
b.locationcode,
b.jobcode) y
WHERE x.receivenotecode = y.receivenotenumber(+)
AND x.polineno = y.polineno(+)
AND x.purchaseitemcode = y.itemcode(+)
AND x.locationtype = y.locationtype(+)
AND x.locationcode = y.locationcode(+)
AND x.jobcode = y.jobcode(+)
AND (x.polineno like upper ('%'||:0||'%') or x.purchaseitemcode like upper ('%'||:0||'%') or x.itemdescription like upper ('%'||:0||'%'))
--AND NVL (x.qty, 0) > NVL (y.qty, 0)
and x.receivenotecode = :1
order by x.polineno`

module.exports = Itemrn