const Plotcode = `SELECT   b.plotcode "plotcode",l.description "description", b.locationtype "locationtype#code", b.locationcode "location",  b.jobcode "jobcode#code",
j.jobdescription "jobcode#description", quantity - NVL (qtyreturn, 0) "quantity"
FROM siv_nursery a,
sivdetails_nursery b,
(SELECT   sivcode, a.plotcode, a.locationcode, a.jobcode,
          SUM (qtyreturn) qtyreturn
     FROM nurserydetail_return a, nursery_return b
    WHERE a.returncode = b.returncode
 GROUP BY sivcode, a.plotcode, a.locationcode, a.jobcode) c,
LOCATION l,
job j
WHERE a.sivcode = b.sivcode
AND b.sivcode = c.sivcode(+)
AND b.plotcode = c.plotcode(+)
AND NVL (b.quantity, 0) - NVL (qtyreturn, 0) > 0
AND b.locationcode = l.locationcode(+)
AND b.locationcode = c.locationcode(+)
AND b.jobcode = c.jobcode(+)
AND b.jobcode = j.jobcode(+)
AND a.sivcode = :1
AND (b.plotcode like upper('%'||:0||'%') or b.locationtype like upper('%'||:0||'%')
 or b.locationcode like upper('%'||:0||'%') or l.description like('%'||:0||'%'))
ORDER BY b.plotcode`

module.exports = Plotcode