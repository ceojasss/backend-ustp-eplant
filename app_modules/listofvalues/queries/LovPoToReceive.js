const potoreceive = `
SELECT pocode "pocode",
suppliercode "suppliercode",
suppliername "suppliername",
FRANCO "franco",
REMARKS "description"
FROM (SELECT a.pocode,
        a.suppliercode,
        b.suppliername,
        A.FRANCO,a.remarks
   FROM lpo a, supplier b, purchasingpolicy c
  WHERE     a.suppliercode = b.suppliercode(+)
        AND a.authorized = 1
        AND NVL (a.status_delivered, 0) = 0
        AND a.process_flag = 'APPROVED'
        AND a.ppcode = c.purchasingpolicycode(+)
        AND CASE WHEN FRANCO IN ('GSP', 'GH') THEN 'AO' ELSE FRANCO END = (select department from epmsapps.userprofile where loginid = :2)
        AND EXISTS
                (SELECT x.*
                   FROM (  SELECT po.pocode,
                                  pod.polineno,
                                  SUM (pod.quantity)     po_quantity
                             FROM lpo po, lpodetails pod
                            WHERE     po.pocode = pod.pocode
                                  AND po.podate <= to_date(:1,'dd-mm-yyyy')
                                  AND CASE WHEN FRANCO IN ('GSP', 'GH') THEN 'AO' ELSE FRANCO END = (select department from epmsapps.userprofile where loginid = :2)
                         GROUP BY po.pocode, pod.polineno) x,
                        (  SELECT rn.pocode,
                                  rnd.polineno,
                                  SUM (
                                        NVL (rnd.quantity, 0)
                                      - NVL (rnd.qtyreturn, 0))    rn_quantity
                             FROM receivenote rn, receivenotedetail rnd
                            WHERE rn.receivenotecode =
                                  rnd.receivenotecode
                         GROUP BY rn.pocode, rnd.polineno) y
                  WHERE     x.pocode = y.pocode(+)
                        AND x.polineno = y.polineno(+)
                        AND NVL (rn_quantity, 0) <
                            NVL (x.po_quantity, 0)
                        AND x.pocode = a.pocode)
 UNION ALL
 SELECT a.pocode,
        a.suppliercode,
        b.suppliername,
        A.FRANCO,a.remarks
   FROM lpo a, supplier b, purchasingpolicy c
  WHERE     a.suppliercode = b.suppliercode(+)
        AND a.authorized = 1
        AND a.process_flag = 'APPROVED'
        AND a.status_delivered = 8888
        AND a.ppcode = c.purchasingpolicycode(+)
        AND CASE WHEN FRANCO IN ('GSP', 'GH') THEN 'AO' ELSE FRANCO END = (select department from epmsapps.userprofile where loginid = :2)
        AND EXISTS
                (SELECT x.*
                   FROM (  SELECT po.pocode,
                                  pod.polineno,
                                  SUM (pod.quantity)     po_quantity
                             FROM lpo po, lpodetails pod
                            WHERE     po.pocode = pod.pocode
                                  AND po.podate <= to_date(:1,'dd-mm-yyyy')
                                  AND CASE WHEN FRANCO IN ('GSP', 'GH') THEN 'AO' ELSE FRANCO END = (select department from epmsapps.userprofile where loginid = :2)
                         GROUP BY po.pocode, pod.polineno) x,
                        (  SELECT rn.pocode,
                                  rnd.polineno,
                                  SUM (
                                        NVL (rnd.quantity, 0)
                                      - NVL (rnd.qtyreturn, 0))    rn_quantity
                             FROM receivenote rn, receivenotedetail rnd
                            WHERE rn.receivenotecode =
                                  rnd.receivenotecode
                         GROUP BY rn.pocode, rnd.polineno) y
                  WHERE     x.pocode = y.pocode(+)
                        AND x.polineno = y.polineno(+)
                        AND NVL (rn_quantity, 0) <
                            NVL (x.po_quantity, 0)
                        AND x.pocode = a.pocode))
                        WHERE    ( upper(POCODE) like upper('%'||:0||'%') or UPPER (REMARKS) LIKE UPPER ('%'||:0||'%'))
                        /*  WHERE CASE
    WHEN NVL (franco, 'X') IN ('GSP', 'GH') THEN 'AO'
    ELSE NVL (franco, 'X')
END = APP_SECURITY_PKG.get_sessioninfo_f@APPSDBLINK ('ESTATECODE')*/
order by POCODE desc`

module.exports = potoreceive