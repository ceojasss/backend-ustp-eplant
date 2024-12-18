const BankDefault = `  SELECT bankcode                                    "code",
bankname || ' (' || bankcode || ')'         "description",
bankaccountcode                             "bankaccountno",
currency                                    "currency"
FROM bank
WHERE BANKCODE = GET_APPS_PARAMVALUE('Cash','EPMS114',getcompany ('COMP_CODE') )
and bankcode like ('%'||:0||'%')`

module.exports = BankDefault