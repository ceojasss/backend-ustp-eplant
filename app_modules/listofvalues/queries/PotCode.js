const potcode = ` SELECT   documentno ,
to_char(tdate,'dd-mm-yyyy') podate,
NVL (company_name, paymentto) suppliercode,
paymentto suppliername,
remarks,
to_char(inputdate,'dd-mm-yyyy') inputdate
FROM   permintaan_anggaran
WHERE   requester LIKE '%PROC'
and  documentno like upper ('%'||:0||'%') or company_name like upper ('%'||:0||'%') or paymentto like upper ('%'||:0||'%') or remarks like upper ('%'||:0||'%')
order by tdate desc`

module.exports = potcode