const PurchaseItempr = `SELECT ITEMCODE "itemcode",ITEMDESCRIPTION "itemdescription",maxstockqty "quantity", UOMCODE "uomcode", itemtype "itemtype"
FROM PURCHASEITEM
WHERE INACTIVEDATE IS NULL
and ( upper(itemcode) like upper('%'||:0||'%')  or UPPER (itemdescription) LIKE UPPER ('%'||:0||'%') 
or UPPER (UOMCODE) LIKE UPPER ('%'||:0||'%') ) and ROWNUM < 100
order by ITEMCODE`

module.exports = PurchaseItempr