const PurchaseSite = `select shippingcode "code" ,description "description",address "address" from shippingaddress
where type = '1' and (shippingcode like upper('%'||:0||'%') or description like upper('%'||:0||'%'))
order by description desc`

module.exports = PurchaseSite