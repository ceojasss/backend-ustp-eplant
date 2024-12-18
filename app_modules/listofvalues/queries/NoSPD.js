const NoSPD = `SELECT   /*h.empcode ,*/ h.no_spd||'|'||CAST(COUNT ( * ) - NVL (diambil, 0) AS VARCHAR(10)) "code", h.no_spd "description", COUNT ( * ) - NVL (diambil, 0) "saldo"
FROM   hr_dec_spd_header h, hr_dec_spd_work w, (  SELECT  substr(nospd,1,27) nospd , SUM (jmlcuti) diambil
                                                    FROM   hr_dayoff
                                                   WHERE   status_cuti = 'APPROVED'
                                                GROUP BY   substr(nospd,1,27)) z
WHERE       h.no_spd = w.no_spd
       AND w.dayoff = 'Y'
       AND empcode = :1
       AND h.no_spd = z.nospd(+)
       AND  date_arr + case when date_arr <= to_date('31052023','ddmmyyyy') then 30  else 15 end >= SYSDATE
       AND (h.no_spd like upper ('%'||:0||'%'))
GROUP BY   empcode, h.no_spd, NVL (diambil, 0)
UNION ALL
SELECT   /*h.empcode,*/
     h.empcode || TO_CHAR (spkl_date, 'ddmmyyyy')||'|'||CAST((1
      * CASE
           WHEN (TO_DATE (TO_CHAR (spkl_date, 'ddmmyyyy') || ' ' || scanpulang, 'ddmmyyyy hh24:mi')
                 - TO_DATE (TO_CHAR (spkl_date, 'ddmmyyyy') || ' ' || scanmasuk, 'ddmmyyyy hh24:mi'))
                * 24 > 8
           THEN
              1
           ELSE
              0
        END)
     - NVL (diambil, 0)AS VARCHAR(10)),
     h.empcode || TO_CHAR (spkl_date, 'ddmmyyyy'),
     (1
      * CASE
           WHEN (TO_DATE (TO_CHAR (spkl_date, 'ddmmyyyy') || ' ' || scanpulang, 'ddmmyyyy hh24:mi')
                 - TO_DATE (TO_CHAR (spkl_date, 'ddmmyyyy') || ' ' || scanmasuk, 'ddmmyyyy hh24:mi'))
                * 24 > 8
           THEN
              1
           ELSE
              0
        END)
     - NVL (diambil, 0)
        saldo
FROM   hr_spkl h, (  SELECT   substr(nospd,1,15) nospd, SUM (jmlcuti) diambil
                     FROM   hr_dayoff
                    WHERE   status_cuti = 'APPROVED'
                 GROUP BY    substr(nospd,1,15)) z, empfingerprintv2 f
WHERE       SUBSTR (TO_CHAR (spkl_date, 'DAY'), 1, 3) IN ('SUN', 'MIN')
     AND status_spkl = 'APPROVED'
     AND spkl_date + case when spkl_date <= to_date('31052023','ddmmyyyy') then 30  else 15 end  >= SYSDATE
     AND h.empcode = :1
     AND h.empcode || TO_CHAR (spkl_date, 'ddmmyyyy') = z.nospd(+)
     AND spkl_date = f.tdate(+)
                        AND h.empcode = f.empcode(+)`

module.exports = NoSPD