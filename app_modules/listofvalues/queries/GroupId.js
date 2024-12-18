const FaGroupId =`Select groupid"groupid",
description"description"
from fagroup
where
(upper (groupid) like upper ('%'||:0||'%') OR
    upper (description) like upper ('%'||:0||'%') )`

module.exports = FaGroupId