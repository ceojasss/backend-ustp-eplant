const Product = `SELECT PRODUCTCODE "productcode" ,PRODUCTDESCRIPTION "productdescription"
FROM PRODUCT WHERE    ( upper(PRODUCTCODE) like upper('%'||:0||'%') or UPPER (PRODUCTDESCRIPTION) LIKE UPPER ('%'||:0||'%'))
     order by PRODUCTCODE`

module.exports = Product
