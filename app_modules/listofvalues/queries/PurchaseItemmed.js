const PurchaseItemmed = `SELECT   x.ITEMCODE,
x.ITEMDESCRIPTION,
x.UOMCODE,
SUM(NVL (qty, 0)) QTY_AVAILABLE
FROM   (SELECT   ITEMCODE, ITEMDESCRIPTION, UOMCODE
   FROM   PURCHASEITEM
  WHERE   ITEMTYPE = '3' AND ITEMCODE LIKE 'MED%') x,
(SELECT   NVL (NVL (x.itemcode, y.itemcode), z.itemcode) itemcode,
            NVL (openingbalanceqty, 0)
          + NVL (qtyadjusment, 0)
          + NVL (z.qty, 0)
          - NVL (y.qty, 0)
             qty
   FROM         HR_STOCKLEDGER_MED x
             FULL OUTER JOIN
                (  SELECT   itemcode, SUM (qty) qty
                     FROM   hr_medical_int x, hr_medical_int_detail y
                    WHERE   docdate BETWEEN TRUNC (
                                               to_date(:1,'dd-mm-yyyy'),
                                               'MM'
                                            )
                                        AND  LAST_DAY(to_date(:1,'dd-mm-yyyy'))
                            AND x.docnum = y.docnum
                 GROUP BY   itemcode) y
             ON x.itemcode = y.itemcode
          FULL OUTER JOIN
             (  SELECT   itemcode, SUM (quantity) qty
                  FROM   (SELECT   itemcode, quantity
                            FROM   receivenote x,
                                   receivenotedetail y,
                                   hr_med_drugs
                           WHERE   x.receivenotecode =
                                      y.receivenotecode
                                   AND rndate BETWEEN TRUNC (
                                                         to_date(:1,'dd-mm-yyyy'),
                                                         'MM'
                                                      )
                                                  AND  LAST_DAY(to_date(:1,'dd-mm-yyyy'))
                                   AND purchaseitemcode = itemcode
                          UNION ALL
                          SELECT   z.itemcode, qtyreturn * -1
                            FROM   returnnote x,
                                   returnnotedetail y,
                                   hr_med_drugs z
                           WHERE   x.returnnotenumber =
                                      y.returnnotenumber
                                   AND rtndate BETWEEN TRUNC (
                                                          to_date(:1,'dd-mm-yyyy'),
                                                          'MM'
                                                       )
                                                   AND  LAST_DAY(to_date(:1,'dd-mm-yyyy'))
                                   AND y.itemcode = z.itemcode
                          UNION ALL
                          SELECT   x.itemcode, qty
                            FROM   hr_medical_local_buy x,
                                   hr_med_drugs z
                           WHERE   tdate BETWEEN TRUNC (
                                                    to_date(:1,'dd-mm-yyyy'),
                                                    'MM'
                                                 )
                                             AND  LAST_DAY(to_date(:1,'dd-mm-yyyy'))
                                   AND x.itemcode = z.itemcode)
              GROUP BY   itemcode) z
          ON x.itemcode = z.itemcode
  WHERE   year = TO_CHAR (to_date(:1,'dd-mm-yyyy'),'YYYY')
          AND month = TO_CHAR (to_date(:1,'dd-mm-yyyy'),'MM'))
y
WHERE   x.itemcode = y.itemcode(+)and ( upper(x.ITEMCODE) like upper('%'||:0||'%') or UPPER (x.ITEMDESCRIPTION) LIKE UPPER ('%'||:0||'%'))
group by x.ITEMCODE,
x.ITEMDESCRIPTION,
x.UOMCODE
ORDER BY x.ITEMCODE`

module.exports = PurchaseItemmed






