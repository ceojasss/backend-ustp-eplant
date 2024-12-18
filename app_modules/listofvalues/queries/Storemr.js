const Store = `select storecode "code",storename "description" 
from storeinfo
where inactivedate is null and storecode not in ('GT','GH','GK')
 and (  upper(storecode) like upper('%'||:0||'%') or  upper(storename) like upper('%'||:0||'%') )`

module.exports = Store