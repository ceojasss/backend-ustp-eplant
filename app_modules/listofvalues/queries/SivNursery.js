const sivnursery = `  SELECT   a.sivcode "code", a.mrcode "mrcode" , d.mrnurserycode "mrnurserycode", e.description "description"
FROM siv_nursery a,
     sivdetails_nursery b, activity_location_control alc,
     (SELECT   a.sivcode, plotcode, locationcode, locationtype, jobcode,
               NVL (SUM (qtyreturn), 0) qtyreturn
          FROM nursery_return a, nurserydetail_return b
         WHERE a.returncode = b.returncode
      GROUP BY a.sivcode, plotcode, locationcode, locationtype, jobcode) c,
     mr_nursery d,
     nursery e
WHERE a.sivcode = b.sivcode
 AND sivdate <= to_date(:1,'dd-mm-yyyy')
 AND b.sivcode = c.sivcode(+)
 AND b.plotcode = c.plotcode(+)
 AND b.locationcode = c.locationcode(+)
 AND b.locationtype = c.locationtype(+)
 AND b.jobcode = c.jobcode(+)
 AND NVL (b.quantity, 0) - NVL (qtyreturn, 0) > 0
 AND a.mrcode = d.mrcode
 AND d.mrnurserycode = e.nurserycode
 AND b.jobcode = alc.activity
 AND alc.source IN ('MN','PN')
/*     AND alc.target = 'OP'
 AND NVL (a.authorized, 0) = 1*/
 AND alc.target = b.locationtype
 AND NVL (e.inactivedate, TO_DATE ('31-12-9999', 'dd-mm-yyyy')) > to_date(:1,'dd-mm-yyyy')
 AND (a.sivcode like upper('%'||:0||'%') or a.mrcode like upper('%'||:0||'%')
 or d.mrnurserycode like upper('%'||:0||'%') or e.description like('%'||:0||'%'))
GROUP BY a.sivcode, a.mrcode, d.mrnurserycode, e.description, b.jobcode`

module.exports = sivnursery