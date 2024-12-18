const ContractorBank = `SELECT bankaccno "bankaccno",bankname "bankname",  accnoname "accnoname" from (SELECT BANKACCNO, BANKNAME,  ACCNONAME
FROM CONTRACTORBANK
WHERE CONTRACTORCODE = NVL ( :1, CONTRACTORCODE))
WHERE (   UPPER (bankname) LIKE ('%' || UPPER ( :0) || '%')
OR UPPER (bankaccno) LIKE ('%' || UPPER ( :0) || '%')
OR UPPER (accnoname) LIKE ('%' || UPPER ( :0) || '%'))`

module.exports = ContractorBank

