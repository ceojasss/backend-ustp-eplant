const activityparamsinfra = `SELECT DISTINCT jobcode "jobcode", jobdescription "description", unitofmeasure "oum"
FROM (SELECT activity
        FROM activity_location_control
       WHERE SOURCE = 'IF' AND TARGET = 'IF' AND activity like 'I%'
         AND :1 not in  ('OP','LC')
         AND NVL (inactivedate, TO_DATE ('01-12-9999', 'dd-mm-yyyy')) >
                                                to_date(:2,'dd-mm-yyyy')
      UNION ALL
      SELECT activity
        FROM activity_location_control
       WHERE SOURCE = 'VH'
         AND TARGET IN( 'OP')
         AND :1 = 'OP'
         AND NVL (inactivedate, TO_DATE ('01-12-9999', 'dd-mm-yyyy')) >
                                                to_date(:2,'dd-mm-yyyy')
      UNION ALL
      SELECT activity
        FROM activity_location_control
       WHERE SOURCE = 'VH'
         AND TARGET IN( 'LC')
         AND :1 = 'LC'
         AND NVL (inactivedate, TO_DATE ('01-12-9999', 'dd-mm-yyyy')) >
                                                to_date(:2,'dd-mm-yyyy')
                                                ) a,
     (SELECT jobcode, jobdescription, unitofmeasure
        FROM job
       WHERE NVL (inactivedate, TO_DATE ('01-12-9999', 'dd-mm-yyyy')) >
                                                to_date(:2,'dd-mm-yyyy')) b
WHERE a.activity = b.jobcode and ( upper(jobcode) like upper('%'||:0||'%') or UPPER (JOBDESCRIPTION) LIKE UPPER ('%'||:0||'%')) 
ORDER BY jobcode`

module.exports = activityparamsinfra