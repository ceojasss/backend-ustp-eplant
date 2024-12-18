const PaymentToPermit = `SELECT   DISTINCT CODE "code",
NAME "description",
JENIS "jenis",
bank "bank",
accno "accno",
accname "accname"
FROM   (SELECT   'SUPPLIER' JENIS,
 s.suppliercode CODE,
 s.suppliername NAME,
 sb.bankname Bank,
 sb.bankaccno accno,
 sb.accnoname accname
FROM   supplier s, supplierbank sb
WHERE   s.suppliercode = sb.suppliercode AND inactivedate IS NULL and
(   UPPER (s.suppliercode) LIKE ('%' || UPPER ( :0) || '%')
OR UPPER (suppliername) LIKE ('%' || UPPER ( :0) || '%'))
UNION ALL
SELECT   'CONTRACTOR' JENIS,
 s.contractorcode CODE,
 s.contractorname NAME,
 sb.bankname bank,
 sb.bankaccno accno,
 sb.accnoname accname
FROM   contractor s, contractorbank sb
WHERE   s.contractorcode = sb.contractorcode AND inactivedate IS NULL
and (   UPPER (s.contractorcode) LIKE ('%' || UPPER ( :0) || '%')
OR UPPER (contractorname) LIKE ('%' || UPPER ( :0) || '%'))
)
ORDER BY   JENIS DESC, CODE`

module.exports = PaymentToPermit