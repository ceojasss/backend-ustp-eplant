const Stockitem = `SELECT ITEMCODE "itemcode",ITEMDESCRIPTION "itemdescription",maxstockqty "quantity", UOMCODE "uomcode",case when itemtype != 0 and itemcode not like 'MED%' and itemcode not like 'Y%' and itemcode not like 'Z%' and itemcode not like 'IT%' then 'false' else 'true' END "dependence",itemtype "itemtype"
FROM PURCHASEITEM
WHERE INACTIVEDATE IS NULL
and ( upper(itemcode) like upper('%'||:0||'%')  or UPPER (itemdescription) LIKE UPPER ('%'||:0||'%') 
or UPPER (UOMCODE) LIKE UPPER ('%'||:0||'%') ) and ROWNUM < 30
order by itemcode
`

module.exports = Stockitem
