const Store = `select storecode "code",storename "description" 
from storeinfo
where inactivedate is null 
 and (  upper(storecode) like upper('%'||:0||'%') or  upper(storename) like upper('%'||:0||'%') )`

module.exports = Store