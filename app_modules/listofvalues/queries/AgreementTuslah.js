const agreementtuslah = `SELECT c.agreementcode  "agreement code",c.contractorcode "contractor", 
TO_CHAR (startdate, 'dd-mm-yyyy')         "startdate",
TO_CHAR (enddate, 'dd-mm-yyyy')           "enddate",
description||' '||c.spk_no ||'  '||c.remarks "description"
FROM contractagreement_ctl c , contractor m
where m.contractorcode = c.contractorcode
and exists (
select z.agreementcode from (
select a.agreementcode--, a.lineno, a.job,a.qty, sum(w.qty)  progressqty
from agreementdetail_ctl a, workinprogress_ctl w
where a.agreementcode = w.agreementcode
and a.lineno = w.agreementlineno
group by a.agreementcode, a.lineno, a.job,a.qty
having a.qty -  sum(w.qty)  > 0
)  z where z.agreementcode = c.agreementcode )
--and c.contractorcode = :1
AND process_flag IN ('APPROVED', 'PROCESSED', 'BGTAPPROVED')
AND (   agreementcode LIKE UPPER ('%' || :0 || '%')
     OR description LIKE UPPER ('%' || :0 || '%'))
ORDER BY c.agreementdate desc, agreementcode`

module.exports = agreementtuslah