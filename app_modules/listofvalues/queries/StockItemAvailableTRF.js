const StockitemAvailable = ` 
SELECT   DISTINCT ITEMCODE "code",
                  pi.ITEMDESCRIPTION "description",
                  UOMCODE "uom",
                  BALANCE_QTY "qty_available"
  FROM   (SELECT   ITEMCODE,
                   pi.ITEMDESCRIPTION,
                   UOMCODE,
                   QUANTITY - NVL(qtyreturn,0)
                      balance_qty
            FROM   PURCHASEITEM pi, receivenotedetail rn
           WHERE   (UPPER (itemcode) LIKE UPPER ('%' || :0 || '%')
                    OR UPPER (pi.itemdescription) LIKE
                         UPPER ('%' || :0 || '%'))
                   AND itemtype = '0'
                   AND rn.purchaseitemcode = pi.itemcode
                   AND (receivenotecode) =  :3
                   AND ROWNUM < 30) pi --left join receivenotedetail rn on rn.purchaseitemcode = pi.itemcode and UPPER (receivenotecode) LIKE UPPER ('%'|| :3 || '%')
UNION ALL
SELECT   DISTINCT ITEMCODE "code",
                  pi.ITEMDESCRIPTION "description",
                  UOMCODE "uom",
                  BALANCE_QTY "qty_available"
  FROM   (SELECT   ITEMCODE,
                   pi.ITEMDESCRIPTION,
                   UOMCODE,
                   realtime_quantity_balance (:2,
                                              itemcode,
                                              SUBSTR (:1, 4, 2),
                                              SUBSTR (:1, 7, 4),
                                              TO_DATE (:1, 'dd-mm-yyyy'))
                      balance_qty
            FROM   PURCHASEITEM pi
           WHERE   (UPPER (itemcode) LIKE UPPER ('%' || :0 || '%')
                    OR UPPER (pi.itemdescription) LIKE
                         UPPER ('%' || :0 || '%'))
                   AND itemtype = '0'
                   AND NVL(LENGTH (:3),0) = 0
                   AND ROWNUM < 30) pi --left join receivenotedetail rn on rn.purchaseitemcode = pi.itemcode and UPPER (receivenotecode) LIKE UPPER ('%'|| :3 || '%')
ORDER BY   "code"`

module.exports = StockitemAvailable