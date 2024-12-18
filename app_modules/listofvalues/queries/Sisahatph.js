const sisahatph = `  SELECT    x.fieldcode "fieldcode", tphcode "tphcode", SUM (ha_cov) "ha_sisa"
FROM   (
SELECT   fieldcode, tphcode, NVL(ha_cov,0) ha_cov
          FROM   optphmaster
         WHERE   inactivedate IS NULL
        UNION ALL
        SELECT   fieldcode, tphcode, ha * -1
          FROM   masterhasiledit
         WHERE   tdate IN
                       (SELECT   TO_CHAR (workdate, 'ddmmyyyy')
                          FROM   empworkingdaystatus
                         WHERE   workdate BETWEEN TRUNC (SYSDATE) - 2
                                              AND  TRUNC (SYSDATE))                                                  
                                              ) x, (
  select fieldcode
  from db_eharvesting.taksasihar
  where inputdate in (
SELECT   TO_CHAR (workdate, 'ddmmyyyy')
                          FROM   empworkingdaystatus
                         WHERE   workdate BETWEEN TRUNC (SYSDATE) - 2
                                              AND  TRUNC (SYSDATE))
group by fieldcode
) y
where x.fieldcode = y.fieldcode AND x.TPHCODE LIKE '%' || :0 || '%'
GROUP BY   x.fieldcode, tphcode
HAVING SUM(NVL(ha_cov,0)) > 0
ORDER BY  "fieldcode", tphcode`


module.exports = sisahatph