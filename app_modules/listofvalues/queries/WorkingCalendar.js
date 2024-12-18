const WorkingCalendar = `SELECT distinct
pyear "pyear" ,pmonth "pmonth"
FROM EMPWORKINGDAYSTATUS
WHERE    ( upper(pyear) like upper('%'||:0||'%') or UPPER (pyear) LIKE UPPER ('%'||:0||'%'))
     order by pyear`

module.exports = WorkingCalendar