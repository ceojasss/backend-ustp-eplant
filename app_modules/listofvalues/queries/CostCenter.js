const CostCenter =`select costcentercode "code",
description"description"
from costcenter
where
( upper (costcentercode) like upper('%'||:0||'%') OR
    upper (description)  like upper ('%'||:0||'%') )`
module.exports = CostCenter