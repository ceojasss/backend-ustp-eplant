const Stockitem = `SELECT ITEMCODE "code",ITEMDESCRIPTION "description",UOMCODE "uom"
FROM PURCHASEITEM
WHERE INACTIVEDATE IS NULL
and ( upper(itemcode) like upper('%'||:0||'%')  or UPPER (itemdescription) LIKE UPPER ('%'||:0||'%') )
and itemtype = '0'`

module.exports = Stockitem