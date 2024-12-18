const Plotcode = `SELECT   plotcode "plotcode", 
(SELECT realtime_quantity_nursery (nurserycode, plotcode)
   FROM DUAL) "quantity" 
FROM nurseryseedplot
WHERE nurserycode = :2
AND nurserycode IN (
   SELECT nurserycode
     FROM nursery
    WHERE NVL (inactivedate, TO_DATE ('31129999', 'DDMMYYYY')) >
    TO_DATE(:1,'DD-MM-YYYY'))  
and ( upper(plotcode) like upper('%'||:0||'%'))
ORDER BY plotcode`

module.exports = Plotcode