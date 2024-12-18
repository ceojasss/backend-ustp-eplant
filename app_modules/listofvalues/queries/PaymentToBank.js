const PaymentToBank = `  SELECT bankaccno "bankaccno", bankname "bankname", accnoname "accnoname"
FROM (SELECT BANKACCNO,
             BANKNAME || '-' || CURRENCY         BANKNAME,
             ACCNONAME,
             CURRENCY
        FROM SUPPLIERBANK
       WHERE SUPPLIERCODE = NVL ( :2, SUPPLIERCODE) AND :1 IN ('1', '3')
      UNION
      SELECT BANKACCNO,
             BANKNAME || '-' || CURRENCY         BANKNAME,
             ACCNONAME,
             CURRENCY
        FROM CONTRACTORBANK
       WHERE     CONTRACTORCODE = NVL ( :2, CONTRACTORCODE)
             AND :1 IN ('2', '3'))
WHERE (   UPPER (bankname) LIKE ('%' || UPPER ( :0) || '%')
      OR UPPER (bankaccno) LIKE ('%' || UPPER ( :0) || '%')
      OR UPPER (accnoname) LIKE ('%' || UPPER ( :0) || '%'))
ORDER BY DECODE (currency, 'IDR', 0, 1)`

module.exports = PaymentToBank