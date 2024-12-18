const TransferVoucher = `SELECT distinct 
a.transfercode "code",
to_char(a.wodate,'dd-mm-yyyy')"description"
FROM transfervoucher a,
     transferdetails b,
     (SELECT   b.transferincode, a.itemcode,
               SUM (quantityreceive) qty_receive
          FROM transferreceivedetail a, transferreceive b
         WHERE b.transferreceivecode = a.transferreceivecode 
      GROUP BY b.transferincode, a.itemcode) c
WHERE (a.transfercode like upper ('%'||:0||'%') or a.wodate like upper('%'||:0||'%')) and
 a.fromstore=:2
 AND a.tostore =:3
 AND a.wodate  <= to_date(:1,'dd-mm-yyyy')
 AND a.transfercode = b.transfercode
 AND b.transfercode = c.transferincode(+)
 AND b.itemcode = c.itemcode(+)
 AND NVL (b.quantity, 0) - NVL (c.qty_receive, 0) > 0
ORDER BY "code" DESC`

module.exports = TransferVoucher
