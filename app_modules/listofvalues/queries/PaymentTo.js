const PaymentTo = `SELECT suppliercode "code", suppliername "descripton"
FROM (SELECT suppliercode, suppliername
        FROM supplier
       WHERE :1 = '1' OR :1 = '3'
      UNION
      SELECT suppliercode, suppliername
        FROM supplier_ffb
       WHERE :1 = '1' OR :1 = '3'
      UNION
      SELECT contractorcode, contractorname
        FROM contractor
       WHERE :1 = '2' OR :1 = '3')
WHERE (   UPPER (suppliercode) LIKE ('%' || UPPER ( :0) || '%')
      OR UPPER (suppliername) LIKE ('%' || UPPER ( :0) || '%'))
      and rownum <=30
ORDER BY 1`

module.exports = PaymentTo