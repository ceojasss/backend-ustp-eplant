const LeaveType=`SELECT
leave_type "leavetype",
description "description"
FROM hr_ref_leavetype
WHERE     
( upper(leave_type) like upper('%'||:0||'%') 
or UPPER (description) LIKE UPPER ('%'||:0||'%'))
ORDER BY leave_type ASC`
module.exports =LeaveType