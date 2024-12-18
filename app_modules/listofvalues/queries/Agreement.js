const agreement = ` SELECT   agreementcode "code", description "description",to_char(startdate,'dd-mm-yyyy') "startdate", to_char(enddate,'dd-mm-yyyy') "enddate"
FROM contractagreement
WHERE  contractorcode = :1
 AND process_flag IN ('APPROVED', 'PROCESSED', 'BGTAPPROVED') 
 and ( agreementcode like UPPER ('%'||:0||'%')  
OR description like upper ('%'||:0||'%'))
ORDER BY agreementcode `

module.exports = agreement