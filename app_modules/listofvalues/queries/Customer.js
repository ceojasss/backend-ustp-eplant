const Customer = `select customercode "customercode", DESCRIPTION "description", npwp "npwp" 
from customer where inactivedate is null and customercode like ('%'||:1||'%')
order by customercode`

module.exports = Customer