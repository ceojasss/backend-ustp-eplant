const Ref = `
SELECT   a.invoicecode,
(NVL (a.invoice_amount, 0) - NVL (b.amount, 0)) * NVL (:6, 0)
   invoice_amount
FROM   (SELECT REF INVOICECODE, r.totalamt - SUM(amtdue) invoice_amount
 FROM empaccountrcv r, empaccountrcvdtl d
WHERE     r.emparid = d.emparid
      AND applied = 1
      AND : 1 = 'EM'
      AND EMPCODE = :2
      AND : 3 IN ('21302004', '11899000', '11809005')
      and  upper(REF ) like upper('%'||:0||'%')
      and rownum < 30 
GROUP BY REF, r.totalamt,EMPCODE
HAVING r.totalamt - SUM(amtdue) > 0
UNION
SELECT   a.invoicecode,
            SUM( (NVL (b.SHIPMENTQUANTITY, 0) * NVL (b.UNITPRICE, 0))
                + ( (NVL (b.SHIPMENTQUANTITY, 0)
                     * NVL (b.UNITPRICE, 0))
                   * (NVL (d.vatcode, 0) * TO_NUMBER(taxcode))
                   / 100)
                - NVL (a.downpayment, 0))
               invoice_amount
     FROM   salesinvoice a,
            salesinvoicedetail b,
            salescontract c,
            salescontractdetail d
    WHERE       a.invoicecode = b.invoicecode
            AND a.agreementcode = c.agreementcode
            AND c.agreementcode = d.agreementcode
            AND b.productcode = d.productcode
            AND a.customercode = :2
            AND NVL (a.paid, 0) = 0
            AND:3 IN
                     (SELECT   jobcode
                        FROM   controljob
                       WHERE   controlsystem = 'Cash'
                               AND itemcode = '10')
 GROUP BY   a.invoicecode
 UNION
   SELECT   a.invoicecode,
            /*SUM( (NVL (b.shipmentquantity, 0) * NVL (b.unitprice, 0))
                * (e.taxrate / 100))
               invoice_amount*/
               SUM(b.amount - NVL (b.amount, 0)) invoice_amount
     FROM   salesinvoice a,
            salesinvoicedetail b,
            salescontract c,
            salescontractdetail d,
            taxmaster e
    WHERE       a.invoicecode = b.invoicecode
            AND a.agreementcode = c.agreementcode
            AND c.agreementcode = d.agreementcode
            AND b.productcode = d.productcode
            AND d.vatcode = e.taxcode
            AND a.invoicedate <= TO_DATE ( :4, 'dd-mm-yyyy')
            AND:1 = 'AR'
            AND a.customercode = :2
            AND:3 IN (SELECT   jobcode
                              FROM   taxmaster
                             WHERE   taxcode = 'VAT-OUT')
 GROUP BY   a.invoicecode
 UNION
   SELECT   a.invoicecode,
            SUM (NVL (b.shipmentquantity, 0) * NVL (b.unitprice, 0))
               invoice_amount
     FROM   salesinvoice a,
            salesinvoicedetail b,
            salescontractltc c,
            taxmaster e
    WHERE   a.invoicecode = b.invoicecode
            AND a.agreementcode = c.salescontractno
            AND DECODE (NVL (c.vat, '0'), '1', 'VAT-OUT', 'N/A') =
                  e.taxcode
            AND a.invoicedate <= TO_DATE ( :4, 'dd-mm-yyyy')
            AND:1 = 'AR'
            AND a.customercode = :2
            AND:3 IN
                     (SELECT   jobcode
                        FROM   controljob
                       WHERE   controlsystem = 'Cash'
                               AND itemcode = '10')
 GROUP BY   a.invoicecode
 UNION
   SELECT   a.invoicecode,
            SUM( (NVL (b.shipmentquantity, 0) * NVL (b.unitprice, 0))
                * (e.taxrate / 100))
               invoice_amount
     FROM   salesinvoice a,
            salesinvoicedetail b,
            salescontractltc c,
            taxmaster e
    WHERE   a.invoicecode = b.invoicecode
            AND a.agreementcode = c.salescontractno
            AND DECODE (NVL (c.vat, '0'), '1', 'VAT-OUT', 'N/A') =
                  e.taxcode
            AND a.invoicedate <= TO_DATE ( :4, 'dd-mm-yyyy')
            AND:1 = 'AR'
            AND a.customercode = :2
            AND:3 IN (SELECT   jobcode
                              FROM   taxmaster
                             WHERE   taxcode = 'VAT-OUT')
 GROUP BY   a.invoicecode
 UNION
 SELECT   agreementcode, NVL (downpayment, 0) amount
   FROM   salescontract
  WHERE       creationdate <= TO_DATE ( :4, 'dd-mm-yyyy')
          AND:1 = 'AR'
          AND customercode = :2
          AND NVL (downpayment, 0) > 0
          AND:3 IN
                   (SELECT   jobcode
                      FROM   controljob
                     WHERE   controlsystem = 'Cash'
                             AND itemcode = '08')
 UNION
 SELECT   a.agreementcode,
          NVL (a.downpayment, 0) * (NVL (t.taxrate, 0) / 100) amount
   FROM   salescontract a, salescontractdetail b, taxmaster t
  WHERE       creationdate <= TO_DATE ( :4, 'dd-mm-yyyy')
          AND:1 = 'AR'
          AND a.customercode = :2
          AND NVL (downpayment, 0) > 0
          AND DECODE (NVL (b.vatcode, '0'), '1', 'VAT-OUT', 'N/A') =
                t.taxcode
          AND a.agreementcode = b.agreementcode
          AND:3 IN (SELECT   jobcode
                            FROM   taxmaster
                           WHERE   taxcode = 'VAT-OUT')) a,
(  SELECT   REFERENCE, SUM (amount) amount
     FROM   receivevoucher a, receivevoucherdetail b
    WHERE       a.vouchercode = b.vouchercode
            AND a.datecreated <= TO_DATE ( :4, 'dd-mm-yyyy')
            AND b.locationtype = :1
            AND b.locationcode = :2
            AND b.jobcode = :3
            AND a.vouchercode !=
                  NVL (:5, 'xXx')
 GROUP BY   REFERENCE) b
WHERE   a.invoicecode = b.REFERENCE(+)
AND NVL (a.invoice_amount, 0) - NVL (b.amount, 0) > 0
ORDER BY   invoicecode
`

module.exports = Ref