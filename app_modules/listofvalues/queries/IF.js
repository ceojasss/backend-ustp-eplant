const IF = ` select ifcode "ifcode",ifname "ifname"
from infrastructure
where ((ifcode) like upper ('%'||:0||'%') or (ifname) like upper ('%'||:0||'%'))  and rownum < 50
order by ifcode`

module.exports = IF