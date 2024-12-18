const Destination = `select   address"address",description"description",shippingcode "code"
 from shippingaddress where address like upper('%'||:0||'%') or description like upper('%'||:0||'%')`

module.exports = Destination