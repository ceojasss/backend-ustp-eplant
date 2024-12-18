const NurseryCode =`SELECT   a.nurserycode "code", a.description "description", total "total"
FROM nursery a,
     (SELECT   nurserycode,
               SUM (realtime_quantity_nursery (nurserycode, plotcode)
                   ) total
          FROM nurseryseedplot
    HAVING SUM (realtime_quantity_nursery (nurserycode, plotcode))> 0
      GROUP BY nurserycode) b
WHERE NVL (a.status_planting, '01') = '02'
 AND NVL (a.status_nursery, '01') = '01'
 AND a.nurserycode IN (
        SELECT nurserycode
          FROM nursery
         WHERE NVL (inactivedate, TO_DATE ('31129999', 'DDMMYYYY')) >
                                                                   SYSDATE)
AND a.DatePlanted < to_date(:1,'DD-MM-YYYY')
 /*AND a.nurserycode IN (SELECT nurserycode
                         FROM nursery_ba
                        WHERE tdate < :mr_nursery.mrdate)
 */
 AND a.nurserycode = b.nurserycode and  ( upper(a.nurserycode) like upper('%'||:0||'%')  or UPPER (description) LIKE UPPER ('%'||:0||'%'))
ORDER BY "code"`

module.exports = NurseryCode