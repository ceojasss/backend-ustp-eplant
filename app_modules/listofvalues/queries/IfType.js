const IFType = ` select iftype "iftype",iftypename "iftypename"
from infrastructuretype
where (iftype like upper ('%'||:0||'%') or iftypename like upper ('%'||:0||'%'))  
order by iftype`

module.exports = IFType