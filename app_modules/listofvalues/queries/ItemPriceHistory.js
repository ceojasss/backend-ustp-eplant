const itempricehistory = `SELECT    
unitprice unitprice  ,
pocode pocode ,
podate,
suppliercode,
suppliername
FROM   (  SELECT   d.pocode,
            PODATE,
            l.suppliercode,
            S.SUPPLIERNAME,
            ITEMCODE,
            UNITPRICE
     FROM   lpo l, LPOdetails d, SUPPLIER S
    WHERE       l.pocode = d.pocode
            AND L.SUPPLIERCODE = S.SUPPLIERCODE
            AND itemcode = :1
            and itemcode like '%'||:0||'%'
 ORDER BY   PODATE DESC)
WHERE   ROWNUM <= 3`

module.exports = itempricehistory
