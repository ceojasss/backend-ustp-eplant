const Contractrequest = `SELECT DISTINCT a.requestcode,
to_char(a.startdate,'dd-mm-yyyy') startdate,
to_char(a.enddate,'dd-mm-yyyy')  enddate,
a.estatecode,
a.divisioncode,
a.contractdescription     remarks
FROM contractrequest  a,
(SELECT requestcode
FROM contractrequestdetail
WHERE NVL (status_flag, '0') = '0') b
WHERE     a.requestcode = b.requestcode
AND to_date(:1,'dd-mm-yyyy') BETWEEN a.startdate AND a.enddate
AND (a.process_flag = 'APPROVED' OR a.authorized = '1' )
and (a.crtype = '0' or a.crtype is null)
AND a.requestcode IN
(SELECT r.requestcode
  FROM (SELECT cd.requestcode, lineno, locationcode
          FROM contractrequestdetail cd, contractrequest cr
         WHERE cd.requestcode = cr.requestcode) r
       LEFT JOIN
       (SELECT d.agreementcode,
               requestno,
               lineno,
               locationcode
          FROM contractagreement c, agreementdetail d
         WHERE d.agreementcode = c.agreementcode) c
           ON     r.requestcode = c.requestno
              AND c.lineno = r.lineno
              AND r.locationcode = c.locationcode
 WHERE c.lineno IS NULL)
AND A.REQUESTCODE NOT IN (SELECT REQUESTCODE FROM FORCECANCELREQUEST)
and a.requestcode like ('%'||:0||'%')`

module.exports = Contractrequest