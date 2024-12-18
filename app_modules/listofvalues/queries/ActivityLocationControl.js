const ActivityLocationControl = `SELECT JOBCODE            "jobcode",
JOBDESCRIPTION     "description"
FROM job j, activity_location_control a
WHERE     j.inactivedate IS NULL
AND (   UPPER (j.jobcode) LIKE UPPER (:0 || '%')
     OR UPPER (j.JOBDESCRIPTION) LIKE UPPER ('%' || :0 || '%'))
AND j.jobcode = a.activity
AND A.SOURCE = :1
and a.target = :2
and rownum < 20
ORDER BY j.JOBCODE`

module.exports = ActivityLocationControl