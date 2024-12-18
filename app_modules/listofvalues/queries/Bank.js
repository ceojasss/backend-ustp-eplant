const Bank = `select bankcode "code", bankname||' ('||bankcode||')' "description" , bankaccountcode "bankaccountno", currency "currency"
from bank where AUTHORIZEDSIG1 in ('HO','SO') and bankcode like ('%'||:0||'%')
order by bankcode`

module.exports = Bank