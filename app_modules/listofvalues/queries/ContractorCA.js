const Contractor = `SELECT DISTINCT a.contractorcode "code", b.contractorname "description"
FROM contractagreement a, contractor b
WHERE a.contractorcode = b.contractorcode and (  a.contractorcode  like UPPER ('%'||:0||'%')  
OR  b.contractorname like UPPER ('%'||:0||'%')
)
ORDER BY a.contractorcode

`

module.exports = Contractor