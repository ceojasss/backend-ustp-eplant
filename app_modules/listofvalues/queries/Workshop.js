const Workshop = `select workshopcode "workshopcode",description "description" 
from workshop 
where inactivedate is null 
 and (  upper(workshopcode) like upper('%'||:0||'%') or  upper(description) like upper('%'||:0||'%') )`

module.exports = Workshop