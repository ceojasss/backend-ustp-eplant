const StockitemAvailable = `  SELECT ITEMCODE            "code",
ITEMDESCRIPTION     "description",
UOMCODE             "uom",
BALANCE_QTY         "qty_available"
FROM (SELECT ITEMCODE,
        ITEMDESCRIPTION,
        UOMCODE,
        realtime_quantity_balance ( :2,
                                   itemcode,
                                   SUBSTR ( :1, 4, 2),
                                   SUBSTR ( :1, 7, 4),
                                   TO_DATE ( :1, 'dd-mm-yyyy'))    balance_qty
   FROM PURCHASEITEM
  WHERE     (   UPPER (itemcode) LIKE UPPER ('%' || :0 || '%')
             OR UPPER (itemdescription) LIKE UPPER ('%' || :0 || '%'))
        AND itemtype = '0'
        AND ROWNUM < 30)
ORDER BY ITEMCODE`

module.exports = StockitemAvailable