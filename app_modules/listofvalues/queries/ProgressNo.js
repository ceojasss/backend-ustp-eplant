const ProgressNo = `select distinct documentno"documentno",
to_char(wipdate,'dd-mm-yyyy') "date"
 from workinprogress where agreementcode=:1  
and ( documentno like UPPER ('%'||:0||'%'))
`

module.exports = ProgressNo