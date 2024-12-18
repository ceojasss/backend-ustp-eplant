const LocationFa =`select 
locationid"locationcode",
description"description"
from famaslocation
where
(upper (locationid) like upper ('%'||:0||'%')
    OR upper (description) like upper ('%'||:0||'%')
    )`
module.exports = LocationFa