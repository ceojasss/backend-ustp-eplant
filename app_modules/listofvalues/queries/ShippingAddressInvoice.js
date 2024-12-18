const Query = `   select shippingcode "shippingcode",description || case when address != description then  ' - '|| address else null end "description"
from shippingaddress
where type = '1'
and (  upper(shippingcode) like upper('%'||:0||'%') or  upper(description) like upper('%'||:0||'%') )
order by shippingcode`

module.exports = Query 