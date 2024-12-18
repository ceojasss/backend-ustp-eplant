const PaymentRef = `SELECT invoicecode,
DECODE (
        NVL (currency, 'IDR'),
        'IDR', ROUND (
                         NVL (invoice_amount, 0)
                       - NVL (amountdebitamount, 0)),
        NVL (invoice_amount, 0) - NVL (amountdebitamount, 0))
        invoice_amount,
remarks
FROM (SELECT a.invoicecode,
        (NVL (a.invoice_amount, 0) - NVL (b.amount, 0))
                invoice_amount,
        debitnote_f (2,
                     a.invoicecode,
                     TO_DATE ( :4, 'dd-mm-yyyy'),
                     3)
                amountdebitamount,
        currency,
        remarks
   FROM (SELECT invoicecode,
                invoice_amount,
                currency,
                remarks
           FROM (SELECT i.invoicecode,
                        i.invoice_amount,
                        l.currency,
                        i.remarks
                   FROM invoice i, invoicelpo il, lpo l
                  WHERE     i.invoicecode = il.invoicecode
                        AND il.lpocode = l.pocode
                        AND NVL (i.invoice_amount, 0) > 0
                        AND i.invoicedate <=
                            TO_DATE ( :4, 'dd-mm-yyyy')
                        AND :1 = 'AP'
                        AND NVL (i.PAID, 0) = 0
                        AND i.suppliercode = :2
                 UNION
                 SELECT a.invoicecode,
                        NVL (b.amount, 0) - NVL (c.dpamount, 0)
                                invoice_amount,
                        CURRCODE
                                currency,
                        a.remarks
                   FROM invoicewopoheader  a
                        LEFT OUTER JOIN
                        (SELECT invoicecode, totalamount dpamount
                           FROM invoicewopoheader) c
                                ON (a.dp_invoicecode = c.invoicecode),
                        (  SELECT invoicecode, SUM (amount) amount
                             FROM (SELECT invoicecode,
                                            (  NVL (amount, 0)
                                             - NVL (discount, 0))
                                          +   (  NVL (amount, 0)
                                               - NVL (discount, 0))
                                            * (t1.taxrate / 100)
                                          -   (  NVL (amount, 0)
                                               - NVL (discount, 0))
                                            * (t2.taxrate / 100)
                                          + NVL (transportationcost, 0)
                                          + NVL (customclearancecost, 0)
                                          + NVL (othercost, 0)        amount
                                     FROM invoicewopodetail a,
                                          taxmaster        t1,
                                          taxmaster        t2
                                    WHERE     NVL (vatcode, 'N/A') =
                                              t1.taxcode
                                          AND NVL (incometax, 'N/A') =
                                              t2.taxcode)
                         GROUP BY invoicecode) b
                  WHERE     a.invoicecode = b.invoicecode
                        AND a.invoicedate <=
                            TO_DATE ( :4, 'dd-mm-yyyy')
                        AND NVL (PAID, 0) = 0
                        AND :1 = 'AP'
                        AND a.suppliercode = :2)
         UNION
           SELECT c.pocode,
                    (NVL (downpayment, 0) / 100)
                  * SUM (
                              (  NVL (c.transportationcost, 0)
                               + NVL (c.customclearancecost, 0)
                               + NVL (c.othercost, 0))
                            + NVL (amount, 0))        amount,
                  c.currency,
                  SUBSTR (c.REMARKS, 1, 200)          remarks
             FROM lpo c,
                  (SELECT pocode,
                          CASE NVL (statusppn, 0)
                                  WHEN 0
                                  THEN
                                          (  NVL (quantity, 0)
                                           * NVL (unitprice, 0))
                                  ELSE
                                            (  NVL (quantity, 0)
                                             * NVL (unitprice, 0))
                                          +   (  NVL (quantity, 0)
                                               * NVL (unitprice, 0))
                                            * (SELECT   NVL (taxrate, 0)
                                                      / 100
                                                 FROM taxmaster
                                                WHERE taxcode = 'VAT-IN')
                          END        amount
                     FROM lpodetails) d
            WHERE     downpayment > 0
                  AND c.process_flag = 'APPROVED'
                  AND c.pocode = d.pocode
                  AND c.podate <= TO_DATE ( :4, 'dd-mm-yyyy')
                  AND :1 = 'AP'
                  AND suppliercode = :2
                  AND :3 = get_ctljob ('Cash', '04')
         GROUP BY c.pocode,
                  c.suppliercode,
                  c.podate,
                  c.currency,
                  SUBSTR (c.REMARKS, 1, 200),
                  NVL (downpayment, 0)) a,
        (  SELECT REFERENCE, SUM (amount) amount
             FROM paymentvoucher a, paymentvoucherdetail b
            WHERE     a.vouchercode = b.vouchercode
                  AND a.datecreated <= TO_DATE ( :4, 'dd-mm-yyyy')
                  AND b.locationtype = :1
                  AND b.locationcode = :2
                  AND b.jobcode = :3
                  AND (a.vouchercode != :5 OR :5 IS NULL)
         GROUP BY REFERENCE) b
  WHERE a.invoicecode = b.REFERENCE(+))
WHERE     NVL (invoice_amount, 0) - NVL (amountdebitamount, 0) NOT BETWEEN -1
                                                                 AND 1
AND :1 = 'AP'
UNION ALL
SELECT INVOICECODE, INVOICE_AMOUNT, remarks
FROM (SELECT NO_SPD invoicecode, 0 invoice_amount, '' remarks
   FROM HR_DEC_SPD_HEADER
  WHERE     APPROVEDATE1 IS NOT NULL
        AND APPROVEDATE1 <= TO_DATE ( :4, 'dd-mm-yyyy')
        AND :1 = 'EM'
        AND empcode = :2
 UNION ALL
 SELECT REF invoicecode, TOTALAMT invoice_amount, '' remarks
   FROM empaccountrcv
  WHERE     :1 = 'EM'
        AND empcode = :2
        AND :3 IN ('21302004', '11899000', '11809005')
 UNION ALL
 SELECT documentno, totalamount, p.remarks
   FROM v_permintaan_anggaran_us P, PARAMETER PP
  WHERE     :1 IN ('EM', 'CB', 'GC')
        AND requester = 'HRD'
        AND :loginid LIKE '% HO'
        AND PP.PARAMETERCODE = 'COMP_CODE'
        AND documentno LIKE '%' || pp.parametername || '%'
        AND (   (TOTALAMOUNT <= 5000000 AND PARAMETERNAME = 'USTP')
             OR (TOTALAMOUNT > 5000000 AND PARAMETERNAME <> 'USTP'))
        AND :3 IN ('11401004',
                   '61201320',
                   '61201321',
                   '61201322',
                   '11401008',
                   '11401005',
                   '11401004',
                   '11401006',
                   '11401007'))
WHERE INVOICECODE NOT IN (SELECT REFERENCE FROM PAYMENTVOUCHERDETAIL)
UNION ALL
SELECT INVOICECODE, INVOICE_AMOUNT, remarks
FROM (SELECT documentno                             INVOICECODE,
        totalamount                            INVOICE_AMOUNT,
        REMARKS || ' - ' || DOCUMENTNO         REMARKS
   FROM v_permintaan_anggaran_us P, PARAMETER PP
  WHERE     :1 IN ('EM', 'CB', 'GC')
        AND requester = 'HRD'
        AND PP.PARAMETERCODE = 'COMP_CODE'
        /*AND ( (TOTALAMOUNT <= 5000000 AND PARAMETERNAME = 'USTP') OR (TOTALAMOUNT > 5000000 AND PARAMETERNAME <> 'USTP'))
        */
        AND :3 IN ('11401004',
                   '61201320',
                   '61201322',
                   '61201321',
                   '11401008',
                   '11401005',
                   '11401004',
                   '11401006',
                   '11401007'))
WHERE     INVOICECODE NOT IN (SELECT REFERENCE FROM PAYMENTVOUCHERDETAIL)
AND :loginid LIKE '% HO'
UNION ALL
SELECT DOCUMENTNO                       INVOICECODE,
TOTALAMOUNT                      INVOICE_AMOUNT,
SUBSTR (REMARKS, 1, 200)         remarks
FROM PERMINTAAN_ANGGARAN V
WHERE     NOT EXISTS
            (SELECT REFERENCE
               FROM PAYMENTVOUCHERDETAIL D
              WHERE D.REFERENCE = V.DOCUMENTNO)
AND TDATE >= TO_DATE ('30/06/2021', 'DD/MM/YYYY')
AND (   ( :loginid LIKE '% HO' OR :loginid LIKE '% ADMIN')
     OR ( :loginid NOT LIKE '% HO' AND DOCUMENTNO NOT LIKE '%HO%'))
AND :1 NOT IN ('CA', 'AP')
UNION ALL
SELECT invoicecode,
CASE
        WHEN NVL (currency, 'IDR') = 'IDR'
        THEN
                ROUND (
                          NVL (invoice_amount, 0)
                        - NVL (amountdebitamount, 0))
        ELSE
                ROUND (
                          NVL (invoice_amount, 0)
                        - NVL (amountdebitamount, 0),
                        2)
END        invoice_amount,
remarks
FROM (SELECT a.invoicecode,
        (NVL (a.invoice_amount, 0) - NVL (b.amount, 0))
                invoice_amount,
        debitnote_f (2,
                     a.invoicecode,
                     TO_DATE ( :4, 'dd-mm-yyyy'),
                     3,
                     :3)
                amountdebitamount,
        currency,
        remarks
   FROM (SELECT invoicecode,
                invoice_amount,
                currency,
                remarks
           FROM ((  SELECT a.agreementcode
                                   invoicecode,
                           SUM (amount * a.downpayment / 100)
                                   invoice_amount,
                           CURRENCY,
                           remarks
                      FROM (SELECT agreementcode,
                                   downpayment,
                                   CURRID                              CURRENCY,
                                   SUBSTR (description, 0, 100)        remarks
                              FROM contractagreement
                             WHERE     downpayment > 0
                                   AND agreementcode NOT IN
                                               (SELECT DISTINCT
                                                       REFERENCE
                                                  FROM paymentvoucherdetail)
                                   AND contractorcode = :2
                                   AND :1 = 'CA'
                                   AND agreementdate <=
                                       TO_DATE ( :4, 'dd-mm-yyyy')
                                   AND :3 = get_ctljob ('Cash', '05')) a,
                           agreementdetail b
                     WHERE a.agreementcode = b.agreementcode
                  GROUP BY CURRENCY, a.agreementcode, a.remarks)
                 UNION
                 SELECT ci.invoicecode,
                        ci.invoice_amount,
                        ca.CURRID         CURRENCY,
                        ci.remarks
                   FROM contract_invoice CI, contractagreement ca
                  WHERE     NVL (ci.invoice_amount, 0) > 0
                        AND ci.invoicedate <=
                            TO_DATE ( :4, 'dd-mm-yyyy')
                        AND :1 = 'CA'
                        AND ci.contractorcode = :2
                        AND ca.agreementcode = ci.agreementcode
                        AND ca.contractorcode = ci.contractorcode
                        AND :3 = get_ctljob ('Cash', '01'))
         UNION
           SELECT ci.invoicecode,
                  SUM (RETENTION),
                  a.currid         currency,
                  ci.remarks
             FROM contract_invoicedetail cid,
                  contract_invoice      ci,
                  contractagreement     a
            WHERE     ci.invoicecode = cid.invoicecode
                  AND cI.agreementcode = a.agreementcode
                  AND ci.invoicedate <= TO_DATE ( :4, 'dd-mm-yyyy')
                  AND :1 = 'CA'
                  AND ci.contractorcode = :2
                  AND :3 = get_ctljob ('Contract', '02')
         GROUP BY ci.invoicecode, a.currid, ci.remarks
         UNION
         SELECT c.invoicecode,
                c.invoice_amount,
                a.currid         currency,
                c.remarks
           FROM contract_invoice_ctl c, contractagreement_ctl a
          WHERE     NVL (c.invoice_amount, 0) > 0
                AND c.agreementcode = a.agreementcode
                AND c.invoicedate <= TO_DATE ( :4, 'dd-mm-yyyy')
                AND :1 = 'CA'
                AND c.contractorcode = :2
                AND :3 = get_ctljob ('Cash', '01')
         UNION
         SELECT a.invoicecode,
                a.totalamount,
                currcode         currency,
                a.remarks
           FROM invoicewopoheader a
          WHERE     invoicedate <= TO_DATE ( :4, 'dd-mm-yyyy')
                AND :1 = 'CA'
                AND suppliercode = :2
                AND :3 = get_ctljob ('Cash', '01')
         UNION
           SELECT c.INVOICECODE,
                  SUM (RETENTION)         AMOUNT,
                  a.CURRID                currency,
                  c.remarks
             FROM CONTRACT_INVOICEDETAIL_CTL D,
                  CONTRACT_INVOICE_CTL      C,
                  contractagreement_ctl     a
            WHERE     C.INVOICECODE = D.INVOICECODE
                  AND c.agreementcode = a.agreementcode
                  AND invoicedate <= TO_DATE ( :4, 'dd-mm-yyyy')
                  AND :1 = 'CA'
                  AND A.contractorcode = :2
                  AND :3 = get_ctljob ('Contract', '02')
         GROUP BY c.INVOICECODE, a.CURRID, c.remarks
         UNION
           SELECT c.INVOICECODE,
                  SUM (RETENTION)         AMOUNT,
                  a.CURRID                currency,
                  c.remarks
             FROM CONTRACT_INVOICEDETAIL D,
                  CONTRACT_INVOICE      C,
                  contractagreement     a
            WHERE     C.INVOICECODE = D.INVOICECODE
                  AND c.agreementcode = a.agreementcode
                  AND invoicedate <= TO_DATE ( :4, 'dd-mm-yyyy')
                  AND :1 = 'CA'
                  AND A.contractorcode = :2
                  AND :3 = get_ctljob ('Contract', '02')
         GROUP BY c.INVOICECODE, a.CURRID, c.remarks) a,
        (  SELECT REFERENCE, SUM (amount) amount
             FROM paymentvoucher a, paymentvoucherdetail b
            WHERE     a.vouchercode = b.vouchercode
                  AND a.datecreated <= TO_DATE ( :4, 'dd-mm-yyyy')
                  AND b.locationtype = :1
                  AND b.locationcode = :2
                  AND b.jobcode = :3
                  AND (a.vouchercode != :5 OR :5 IS NULL)
         GROUP BY REFERENCE) b
  WHERE a.invoicecode = b.REFERENCE(+))
WHERE     NVL (invoice_amount, 0) - NVL (amountdebitamount, 0) > 0
AND INVOICECODE LIKE '%' || :0 || '%'
ORDER BY invoicecode`

module.exports = PaymentRef