const IFCode = `select ifcode "code",ifname "description"
from infrastructure
where (upper(ifcode) like upper('%'||:0||'%') or upper(ifname) like upper('%'||:0||'%'))  
order by ifcode`

module.exports = IFCode