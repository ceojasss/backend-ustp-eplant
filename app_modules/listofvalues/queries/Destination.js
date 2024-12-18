const Destination = `select shippingcode "code", description"description", address"address"
 from shippingaddress where shippingcode like upper('%'||:0||'%') or description like upper('%'||:0||'%')`

module.exports = Destination