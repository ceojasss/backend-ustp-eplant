const baseQuery = `select productcode "code",productdescription "descripiton" from product
where productcode in ('CPO','PK') and  ((productcode) like upper ('%'||:0||'%') or  (productdescription) like upper ('%'||:0||'%'))`

module.exports = baseQuery