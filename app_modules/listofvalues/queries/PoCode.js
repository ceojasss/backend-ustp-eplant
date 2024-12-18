const pocode = ` SELECT   pocode ,
to_char(L.PODATE,'dd-mm-yyyy') podate,
s.suppliercode,
suppliername,
l.remarks,
to_char(L.INPUTDATE,'dd-mm-yyyy') inputdate
FROM   (SELECT   x.pocode,
          x.podate,
          x.suppliercode,
          x.remarks,
          x.inputdate
   FROM   epms_gcm.lpo x, epms_gcm.receivenote y
  WHERE   include_transport = 'N'
  AND x.pocode =y.pocode
  AND rndate >= to_date(:1,'dd-mm-yyyy')- 365
  group by x.pocode,
          x.podate,
          x.suppliercode,
          x.remarks,
          x.inputdate
 UNION ALL
 SELECT   x.pocode,
          x.podate,
          x.suppliercode,
          x.remarks,
          x.inputdate
   FROM   epms_sje.lpo x, epms_sje.receivenote y
  WHERE   include_transport = 'N'
  AND x.pocode =y.pocode
  AND rndate >=  to_date(:1,'dd-mm-yyyy')- 365
 group by x.pocode,
          x.podate,
          x.suppliercode,
          x.remarks,
          x.inputdate
 UNION ALL
 SELECT   x.pocode,
          x.podate,
          x.suppliercode,
          x.remarks,
          x.inputdate
   FROM   epms_sbe.lpo x, epms_sbe.receivenote y
  WHERE   include_transport = 'N'
  AND x.pocode =y.pocode
  AND rndate >=  to_date(:1,'dd-mm-yyyy')- 365
 group by x.pocode,
          x.podate,
          x.suppliercode,
          x.remarks,
          x.inputdate
 UNION ALL
 SELECT   x.pocode,
          x.podate,
          x.suppliercode,
          x.remarks,
          x.inputdate
   FROM   epms_slm.lpo x, epms_slm.receivenote y
  WHERE   include_transport = 'N'
  AND x.pocode =y.pocode
  AND rndate >= to_date(:1,'dd-mm-yyyy')- 365
 group by x.pocode,
          x.podate,
          x.suppliercode,
          x.remarks,
          x.inputdate
 UNION ALL
 SELECT   x.pocode,
          x.podate,
          x.suppliercode,
          x.remarks,
          x.inputdate
   FROM   epms_smg.lpo x, epms_smg.receivenote y
  WHERE   include_transport = 'N'
      AND x.pocode =y.pocode
      AND rndate >= to_date(:1,'dd-mm-yyyy')- 365
  group by x.pocode,
          x.podate,
          x.suppliercode,
          x.remarks,
          x.inputdate               
) l, supplier s
WHERE   l.suppliercode = s.suppliercode  and  pocode like upper ('%'||:0||'%') or suppliername like upper ('%'||:0||'%') 
--or l.remarks like upper ('%'||:0||'%')             
order by pocode`

module.exports = pocode