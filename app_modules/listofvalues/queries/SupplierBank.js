const SupplierBank = `SELECT bankaccno "bankaccno",bankname "bankname",  accnoname "accnoname" from (SELECT BANKACCNO, BANKNAME,  ACCNONAME
FROM SUPPLIERBANK
WHERE SUPPLIERCODE = NVL ( :1, SUPPLIERCODE))
WHERE (   UPPER (bankname) LIKE ('%' || UPPER ( :0) || '%')
OR UPPER (bankaccno) LIKE ('%' || UPPER ( :0) || '%')
OR UPPER (accnoname) LIKE ('%' || UPPER ( :0) || '%'))`

module.exports = SupplierBank

