const _ = require('lodash')
const database = require('../../../oradb/dbHandler')

const baseQuery = `
SELECT   
x.empcode "empcode",
empname "empname",
x.tdate "tdate",
CASE WHEN jamkerja IS NULL AND x.s = 'F' THEN 'WFO' ELSE jamkerja END
           ||
           CASE 
           WHEN  x.jamkerja = 'WFO' AND  NVL(e_in.status_jarak,'BIRU') IN ('BIRU','MERAH') THEN '*'
           WHEN x.jamkerja = 'WFO' AND  NVL(e_out.status_jarak,'BIRU') IN ('BIRU','MERAH')  THEN '*'
           ELSE '' END "s",
x.s "fn",
CASE
   WHEN x.s = 'F' AND scanmasuk IS NULL THEN 'Tidak'
   ELSE scanmasuk
END
   "scanmasuk",
CASE
   WHEN x.s = 'F' AND scanpulang IS NULL THEN 'Tidak'
   ELSE scanpulang
END
   "scanpulang",
CASE
   WHEN     x.s = 'F'
        AND NVL (jamkerja, 'WFO') = 'WFO'
        AND TO_CHAR (
              TO_DATE (
                    TO_CHAR (x.tdate, 'DD/MM/YYYY')
                 || ' '
                 || NVL (scanmasuk, '09:31'),
                 'DD/MM/YYYY hh24:mi'
              ),
              'sssss'
           )
           - TO_CHAR (
                TO_DATE (
                   TO_CHAR (x.tdate, 'DD/MM/YYYY') || ' ' || '09:30',
                   'DD/MM/YYYY hh24:mi'
                ),
                'sssss'
             ) > 0
   THEN
      CASE WHEN im.tdate IS NOT NULL THEN 'Ada' ELSE 'Tidak' END
   WHEN     x.s = 'F'
        AND NVL (jamkerja, 'WFO') = 'WFH'
        AND TO_CHAR (
              TO_DATE (
                    TO_CHAR (x.tdate, 'DD/MM/YYYY')
                 || ' '
                 || NVL (scanmasuk, '08:31'),
                 'DD/MM/YYYY hh24:mi'
              ),
              'sssss'
           )
           - TO_CHAR (
                TO_DATE (
                   TO_CHAR (x.tdate, 'DD/MM/YYYY') || ' ' || '08:30',
                   'DD/MM/YYYY hh24:mi'
                ),
                'sssss'
             ) > 0
   THEN
      CASE WHEN im.tdate IS NOT NULL THEN 'Ada' ELSE 'Tidak' END
END
   "ijinmasuk",
CASE
   WHEN     x.s = 'F'
        AND NVL (jamkerja, 'WFO') = 'WFO'
        AND TO_CHAR (
              TO_DATE (
                 TO_CHAR (x.tdate, 'DD/MM/YYYY') || ' ' || '15:00',
                 'DD/MM/YYYY hh24:mi'
              ),
              'sssss'
           )
           - TO_CHAR (
                TO_DATE (
                      TO_CHAR (x.tdate, 'DD/MM/YYYY')
                   || ' '
                   || NVL (scanpulang, '14:59'),
                   'DD/MM/YYYY hh24:mi'
                ),
                'sssss'
             ) > 0
   THEN
      CASE WHEN ip.tdate IS NOT NULL THEN 'Ada' ELSE 'Tidak' END
   WHEN     x.s = 'F'
        AND NVL (jamkerja, 'WFO') = 'WFH'
        AND TO_CHAR (
              TO_DATE (
                 TO_CHAR (x.tdate, 'DD/MM/YYYY') || ' ' || '17:00',
                 'DD/MM/YYYY hh24:mi'
              ),
              'sssss'
           )
           - TO_CHAR (
                TO_DATE (
                      TO_CHAR (x.tdate, 'DD/MM/YYYY')
                   || ' '
                   || NVL (scanpulang, '16:59'),
                   'DD/MM/YYYY hh24:mi'
                ),
                'sssss'
             ) > 0
   THEN
      CASE WHEN ip.tdate IS NOT NULL THEN 'Ada' ELSE 'Tidak' END
END
   "ijinpulang",
CASE WHEN dd.tdate IS NOT NULL THEN 'Ada' ELSE NULL END "dinasdalam",
e_in.gps "gps_masuk",
e_in.filename "filename_masuk",
e_in.jarak "jarak_masuk",
e_in.status_jarak "status_jarak_masuk",
e_out.gps "gps_keluar",
e_out.filename "filename_keluar",
e_out.jarak "jarak_keluar",
e_out.status_jarak "status_jarak_keluar"
FROM   (SELECT  
          empcode,
          tdate,
          jamkerja,
          'F' s,
          scanmasuk scanmasuk,
          scanpulang scanpulang
   FROM   empfingerprintv2
  WHERE   tdate BETWEEN TO_DATE (:p_date, 'DD/MM/YYYY')
                    AND  TO_DATE (:p_date2, 'DD/MM/YYYY')
          AND TO_DATE (:p_date2, 'DD/MM/YYYY')
             - TO_DATE (:p_date, 'DD/MM/YYYY') <= 31
 UNION ALL
 SELECT   empcode,
          tdate,
          NULL jamkerja,
          'N' s,
          attdcode,
          NULL
   FROM   emp_ba_absent
  WHERE   tdate BETWEEN TO_DATE (:p_date, 'DD/MM/YYYY')
                    AND  TO_DATE (:p_date2, 'DD/MM/YYYY')
          AND TO_DATE (:p_date2, 'DD/MM/YYYY')
             - TO_DATE (:p_date, 'DD/MM/YYYY') <= 31
          AND attdcode NOT IN ('I', 'DD', 'KJ')
 ORDER BY   empcode) x,
empmasterepms e,
mas_position m,
(SELECT   ROWID "rowid",empcode, leave_date tdate
   FROM   hr_short_leave
  WHERE   leave_type = '0' AND status_ijin = 'APPROVED') im,
(SELECT   ROWID "rowid",empcode, leave_date tdate
   FROM   hr_short_leave
  WHERE   leave_type = '1' AND status_ijin = 'APPROVED') ip,
(SELECT   ROWID "rowid",empcode, leave_date tdate
   FROM   hr_short_leave
  WHERE   leave_type = '2' AND status_ijin = 'APPROVED') dd,
(SELECT   ROWID "rowid",empcode,
          TRUNC (checktime) tdate,
          latitude || ',' || longitude gps,
          VERIFYCODE filename,
          ROUND (HITUNG_JARAK_F (LONGITUDE, LATITUDE), 2) JARAK,
          CASE
             WHEN ROUND (HITUNG_JARAK_F (LONGITUDE, LATITUDE), 2) <
                     0.3
             THEN
                'HIJAU'
             WHEN ROUND (HITUNG_JARAK_F (LONGITUDE, LATITUDE), 2) BETWEEN 0.3
                                                                      AND  50
             THEN
                'BIRU'
             ELSE
                'MERAH'
          END
             STATUS_JARAK
   FROM   att_checkinout
  WHERE   (empcode, checktime) IN
                (  SELECT   empcode, MIN (checktime)
                     FROM   att_checkinout
                    WHERE   TRUNC (checktime) BETWEEN TO_DATE (
                                                         :p_date,
                                                         'DD/MM/YYYY'
                                                      )
                                                  AND  TO_DATE (
                                                          :p_date2,
                                                          'DD/MM/YYYY'
                                                       )
                            AND TO_DATE (:p_date2, 'DD/MM/YYYY')
                               - TO_DATE (:p_date, 'DD/MM/YYYY') <=
                                  31
                            AND checktype = 1
                 GROUP BY   empcode, TRUNC (checktime))) e_in,
(SELECT   ROWID "rowid",empcode,
          TRUNC (checktime) tdate,
          latitude || ',' || longitude gps,
          VERIFYCODE filename,
          ROUND (HITUNG_JARAK_F (LONGITUDE, LATITUDE), 2) JARAK,
          CASE
             WHEN ROUND (HITUNG_JARAK_F (LONGITUDE, LATITUDE), 2) <
                     0.3
             THEN
                'HIJAU'
             WHEN ROUND (HITUNG_JARAK_F (LONGITUDE, LATITUDE), 2) BETWEEN 0.3
                                                                      AND  50
             THEN
                'BIRU'
             ELSE
                'MERAH'
          END
             STATUS_JARAK
   FROM   att_checkinout
  WHERE   (empcode, checktime) IN
                (  SELECT empcode, MIN (checktime)
                     FROM   att_checkinout
                    WHERE   TRUNC (checktime) BETWEEN TO_DATE (
                                                         :p_date,
                                                         'DD/MM/YYYY'
                                                      )
                                                  AND  TO_DATE (
                                                          :p_date2,
                                                          'DD/MM/YYYY'
                                                       )
                            AND TO_DATE (:p_date2, 'DD/MM/YYYY')
                               - TO_DATE (:p_date, 'DD/MM/YYYY') <=
                                  31
                            AND checktype = 2
                 GROUP BY   empcode, TRUNC (checktime))) e_out
WHERE       x.empcode = e.empcode
AND e.id_position = m.code
AND x.empcode = im.empcode(+)
AND x.tdate = im.tdate(+)
AND x.empcode = ip.empcode(+)
AND x.tdate = ip.tdate(+)
AND x.empcode = dd.empcode(+)
AND x.tdate = dd.tdate(+)
AND x.empcode = e_in.empcode(+)
AND x.tdate = e_in.tdate(+)
AND x.empcode = e_out.empcode(+)
AND x.tdate = e_out.tdate(+)
UNION ALL
select empcode, get_empname(empcode),workdate, NULL s, NULL FN, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,NULL,NULL,NULL  
from empmasterepms e, empworkingdaystatus w
where dateterminate is null and id_position like '0%'
and workdate between TO_DATE (
                                                         :p_date,
                                                         'DD/MM/YYYY'
                                                      )
                                                  AND  TO_DATE (
                                                          :p_date2,
                                                          'DD/MM/YYYY'
                                                       )
and (empcode, workdate) not in (select empcode, tdate from empfingerprintv2_ba 
where tdate between TO_DATE (
                                                         :p_date,
                                                         'DD/MM/YYYY'
                                                      )
                                                  AND  TO_DATE (
                                                          :p_date2,
                                                          'DD/MM/YYYY'
                                                       ))
and attdcode = 'KJ'
and empcode not in ('0500004','0700005','1')
                            AND TO_DATE (:p_date2, 'DD/MM/YYYY')
                               - TO_DATE (:p_date, 'DD/MM/YYYY') <=
                                  31
ORDER BY   "tdate", "empcode"
`


const fetchData = async function (users, params, routes, callback) {

   binds = {}

   // console.log(users.loginid)
   binds.p_date = (!params.p_date ? '' : params.p_date)
   binds.p_date2 = (!params.p_date2 ? '' : params.p_date2)

   let result

   try {
      result = await database.siteWithDefExecute(users, routes, baseQuery, binds)

      console.log('result :', result)
   } catch (error) {
      callback(error, '')
   }
   callback('', result)
} 


module.exports = {
   fetchData
}
 

