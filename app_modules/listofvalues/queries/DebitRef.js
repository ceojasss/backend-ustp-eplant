const DebitRef =
`SELECT   invoicecode "invoicecode",
invoicedate "invoicedate",
suppliercode || ' - ' || suppliername "descs",
suppliercode,
suppliername,
invoice_amount,
INV,
PAYMENT,
faktur,
paid,
pocode,
remarks,
currid,
rate,
vatcode
FROM   (SELECT   a.invoicecode,
          a.invoicedate,
          a.suppliercode,
          b.suppliername,
          A.PAID,
          (NVL (a.invoice_amount, 0) - (NVL (d.paymentamount, 0))) invoice_amount,
          NVL (a.invoice_amount, 0) INV,
          NVL (d.paymentamount, 0) PAYMENT,
          faktur,
          c.pocode,
          a.remarks,
          c.currency currid,
          DECODE (c.currency, get_home_currency, 1, pkg_general_function.gn_check_daily_rate (c.currency, a.invoicedate)) rate,
          '' vatcode
   FROM   invoice a,
          supplier b,
          lpo c,
          invoicelpo il,
          (  SELECT   invoiceno, SUM (paymentamount) paymentamount
               FROM   (  SELECT   invoiceno invoiceno, SUM (a.downpaymentamount) paymentamount
                           FROM   supplierpaymentdetail a
                       GROUP BY   invoiceno
                       UNION
                         SELECT   reference invoiceno, SUM (a.amount) paymentamount
                           FROM   paymentvoucherdetail a
                          WHERE   locationtype = 'AP'
                       GROUP BY   REFERENCE
                       UNION ALL
                         SELECT   INVCODEREF invoiceno, SUM (DBNAMOUNT) paymentamount
                           FROM   DRNOTE D, DRNOTE_D DD
                          WHERE   DD.DRNOTEID = D.DRNOTEID
                       GROUP BY   INVCODEREF)
           GROUP BY   invoiceno) d
  WHERE       a.suppliercode = b.suppliercode
          AND il.invoicecode = a.invoicecode
          AND il.lpocode = c.pocode
          AND a.invoicecode = d.invoiceno(+)
          AND a.invoicedate <= TO_DATE(:1, 'DD/MM/YYYY')                                                             /*AND NVL (a.paid, 0) = 0*/
 UNION ALL
 SELECT   a.invoicecode,
          a.invoicedate,
          a.suppliercode,
          suppliername,
          A.PAID,
          (NVL (a.totalamount, 0) - (NVL (d.paymentamount, 0))) invoice_amount,
          NVL (a.totalamount, 0) INV,
          NVL (d.paymentamount, 0) PAYMENT,
          faktur,
          '-' pocode,
          a.remarks,
          a.currcode currid,
          DECODE (a.currcode, get_home_currency, 1, pkg_general_function.gn_check_daily_rate (a.currcode, a.invoicedate)) rate,
          '' vatcode
   FROM   invoicewopoheader a, supplier b, (  SELECT   invoiceno, SUM (paymentamount) paymentamount
                                                FROM   (  SELECT   invoiceno invoiceno, SUM (a.downpaymentamount) paymentamount
                                                            FROM   supplierpaymentdetail a
                                                        GROUP BY   invoiceno
                                                        UNION
                                                          SELECT   reference invoiceno, SUM (a.amount) paymentamount
                                                            FROM   paymentvoucherdetail a
                                                           WHERE   locationtype = 'AP'
                                                        GROUP BY   REFERENCE
                                                        UNION ALL
                                                          SELECT   INVCODEREF invoiceno, SUM (DBNAMOUNT) paymentamount
                                                            FROM   DRNOTE D, DRNOTE_D DD
                                                           WHERE   DD.DRNOTEID = D.DRNOTEID
                                                        GROUP BY   INVCODEREF)
                                            GROUP BY   invoiceno) d
  WHERE       a.suppliercode = b.suppliercode
          AND A.suppliercode <> 'SPLM001'
          AND a.invoicecode = d.invoiceno(+)
          AND a.invoicedate <= TO_DATE(:1, 'DD/MM/YYYY'))
WHERE   invoice_amount NOT BETWEEN -10 AND 10 AND (invoicecode LIKE UPPER ('%' || :0 || '%'))
ORDER BY   invoicedate DESC`

module.exports = DebitRef


// const DebitRef =`SELECT   invoicecode,     
// invoicedate,
// suppliercode vendorcode,
// suppliername vendorname,
// suppliercode || ' - ' || suppliername descs,
// invoice_amount,
// INV,
// PAYMENT,
// faktur,
// paid,
// pocode,
// remarks,
// currid,
// rate,
// vatcode
// FROM   (SELECT   a.invoicecode,
//           a.invoicedate,
//           a.suppliercode,
//           suppliername,
//           A.PAID,
//           (NVL (a.invoice_amount, 0) - (NVL (d.paymentamount, 0))) invoice_amount,
//           NVL (a.invoice_amount, 0) INV,
//           NVL (d.paymentamount, 0) PAYMENT,
//           faktur,
//           c.pocode,
//           a.remarks,
//           c.currency currid,
//           DECODE (c.currency, get_home_currency, 1, pkg_general_function.gn_check_daily_rate (c.currency, a.invoicedate)) rate,
//           '' vatcode
//    FROM   invoice a,
//           supplier b,
//           lpo c,
//           invoicelpo il,
//           (  SELECT   invoiceno, SUM (paymentamount) paymentamount
//                FROM   (  SELECT   invoiceno invoiceno, SUM (a.downpaymentamount) paymentamount
//                            FROM   supplierpaymentdetail a
//                        GROUP BY   invoiceno
//                        UNION
//                          SELECT   reference invoiceno, SUM (a.amount) paymentamount
//                            FROM   paymentvoucherdetail a
//                           WHERE   locationtype = 'AP'
//                        GROUP BY   REFERENCE
//                        UNION ALL
//                          SELECT   INVCODEREF invoiceno, SUM (DBNAMOUNT) paymentamount
//                            FROM   DRNOTE D, DRNOTE_D DD
//                           WHERE   DD.DRNOTEID = D.DRNOTEID
//                        GROUP BY   INVCODEREF)
//            GROUP BY   invoiceno) d
//   WHERE       a.suppliercode = b.suppliercode
//           AND il.invoicecode = a.invoicecode
//           AND il.lpocode = c.pocode
//           AND a.invoicecode = d.invoiceno(+)
//           AND a.invoicedate <= :drnotedate                                                              
//  UNION ALL
//  SELECT   a.invoicecode,
//           a.invoicedate,
//           a.suppliercode,
//           suppliername,
//           A.PAID,
//           (NVL (a.totalamount, 0) - (NVL (d.paymentamount, 0))) invoice_amount,
//           NVL (a.totalamount, 0) INV,
//           NVL (d.paymentamount, 0) PAYMENT,
//           faktur,
//           '-' pocode,
//           a.remarks,
//           a.currcode currid,
//           DECODE (a.currcode, get_home_currency, 1, pkg_general_function.gn_check_daily_rate (a.currcode, a.invoicedate)) rate,
//           '' vatcode
//    FROM   invoicewopoheader a, supplier b, (  SELECT   invoiceno, SUM (paymentamount) paymentamount
//                                                 FROM   (  SELECT   invoiceno invoiceno, SUM (a.downpaymentamount) paymentamount
//                                                             FROM   supplierpaymentdetail a
//                                                         GROUP BY   invoiceno
//                                                         UNION
//                                                           SELECT   reference invoiceno, SUM (a.amount) paymentamount
//                                                             FROM   paymentvoucherdetail a
//                                                            WHERE   locationtype = 'AP'
//                                                         GROUP BY   REFERENCE
//                                                         UNION ALL
//                                                           SELECT   INVCODEREF invoiceno, SUM (DBNAMOUNT) paymentamount
//                                                             FROM   DRNOTE D, DRNOTE_D DD
//                                                            WHERE   DD.DRNOTEID = D.DRNOTEID
//                                                         GROUP BY   INVCODEREF)
//                                             GROUP BY   invoiceno) d
//   WHERE       a.suppliercode = b.suppliercode
//           AND A.suppliercode <> 'SPLM001'
//           AND a.invoicecode = d.invoiceno(+)
//           AND a.invoicedate <= :drnotedate)
// WHERE   invoice_amount NOT BETWEEN -10 AND 10
// and :drnotetypecode = 'AP'
// union all
// SELECT   invoicecode,
// invoicedate,
// contractorcode,
// contractorname,
// contractorcode || ' - ' || contractorname descs,
// inv_applied,
// invoice_amount,
// 0 payment, 
// faktur,
// paid,
// agreementcode,
// remarks,
// currid,
// rate,
// vatcode
// FROM   (SELECT   a.invoicecode,
//           a.invoicedate,
//           a.contractorcode,
//           contractorname,
//           A.PAID,
//           NVL (a.invoice_amount, 0) inv_applied,
//           (NVL (a.invoice_amount, 0) - (NVL (d.paymentamount, 0))) invoice_amount,
//           NVL (a.invoice_amount, 0) INV,
//           NVL (d.paymentamount, 0) PAYMENT,
//           NVL (DN, 0) DN,
//           faktur,
//           a.agreementcode,
//           a.remarks,
//           c.currid,
//           DECODE (c.currid, get_home_currency, 1, pkg_general_function.gn_check_daily_rate (c.currid, a.invoicedate)) rate,
//           cid.vatcode
//    FROM   contract_invoice a,
//           (SELECT   DISTINCT invoicecode, vatcode FROM contract_invoicedetail) cid,
//           contractor b,
//           contractagreement c,
//           (  SELECT   documentno, SUM (a.paid) paymentamount
//                FROM   contractorpaymentdetail a
//            GROUP BY   documentno
//            UNION
//              SELECT   reference, SUM (a.amount) paymentamount
//                FROM   paymentvoucherdetail a
//               WHERE   locationtype = 'CA'
//            GROUP BY   REFERENCE) d,
//           (  SELECT   INVCODEREF, SUM (DD.DBNAMOUNT) DN
//                FROM   DRNOTE D, DRNOTE_D DD
//               WHERE   D.DRNOTEID = DD.DRNOTEID
//            GROUP BY   INVCODEREF) DN
//   WHERE       a.contractorcode = b.contractorcode
//           AND a.agreementcode = c.agreementcode
//           AND a.invoicecode = cid.invoicecode
//           AND A.INVOICECODE = DN.INVCODEREF(+)
//           AND a.invoicecode = d.documentno(+)
//           AND a.invoicedate <= TO_DATE(:drnotedate, 'DD/MM/YYYY')
//           AND NVL (a.paid, 0) = 0
//  UNION ALL
//  SELECT   a.invoicecode,
//           a.invoicedate,
//           a.contractorcode,
//           contractorname,
//           A.PAID,
//           NVL (a.invoice_amount, 0) inv_applied,
//           (NVL (a.invoice_amount, 0) - (NVL (d.paymentamount, 0))) invoice_amount,
//           NVL (a.invoice_amount, 0) INV,
//           NVL (d.paymentamount, 0) PAYMENT,
//           NVL (DN, 0) DN,
//           faktur,
//           a.agreementcode,
//           a.remarks,
//           c.currid,
//           DECODE (c.currid, get_home_currency, 1, pkg_general_function.gn_check_daily_rate (c.currid, a.invoicedate)) rate,
//           cid.vatcode
//    FROM   contract_invoice_ctl a,
//           (SELECT   DISTINCT invoicecode, vatcode FROM contract_invoicedetail_ctl) cid,
//           contractor b,
//           contractagreement_ctl c,
//           (  SELECT   documentno, SUM (a.paid) paymentamount
//                FROM   contractorpaymentdetail a
//            GROUP BY   documentno
//            UNION
//              SELECT   reference, SUM (a.amount) paymentamount
//                FROM   paymentvoucherdetail a
//               WHERE   locationtype = 'CA'
//            GROUP BY   REFERENCE) d,
//           (  SELECT   INVCODEREF, SUM (DD.DBNAMOUNT) DN
//                FROM   DRNOTE D, DRNOTE_D DD
//               WHERE   D.DRNOTEID = DD.DRNOTEID
//            GROUP BY   INVCODEREF) DN
//   WHERE       a.contractorcode = b.contractorcode
//           AND a.agreementcode = c.agreementcode
//           AND a.invoicecode = cid.invoicecode
//           AND A.INVOICECODE = DN.INVCODEREF(+)
//           AND a.invoicecode = d.documentno(+)
//           AND a.invoicedate <= :drnotedate
//           AND NVL (a.paid, 0) = 0)
// WHERE   invoice_amount - DN <> 0
// and :drnotetypecode = 'CA' 
// ORDER BY   invoicedate DESC`

// module.exports = DebitRef