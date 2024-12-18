const ReceivenoteRn = `SELECT receivenotecode "code",pocode "pocode",suppliercode "suppliercode"
FROM receivenote where suppliercode IS NOT NULL and  case when :1 not like '%HO' and pocode like '%HO%' then null  else pocode end = pocode 
and  (   (receivenotecode) LIKE UPPER ('%' || :0 || '%') ) and rownum < 100 and invoicecode is null
order BY rndate DESC
`

module.exports = ReceivenoteRn
