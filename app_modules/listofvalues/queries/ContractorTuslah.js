const Contractortuslah = `SELECT DISTINCT a.contractorcode "code", b.contractorname "description"
FROM contractagreement_ctl a, contractor b
WHERE a.contractorcode = b.contractorcode and (  a.contractorcode  like UPPER ('%'||:0||'%')  
OR  b.contractorname like UPPER ('%'||:0||'%')
)
ORDER BY a.contractorcode

`

module.exports = Contractortuslah