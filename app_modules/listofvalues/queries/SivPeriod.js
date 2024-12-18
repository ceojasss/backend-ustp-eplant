const SivPeriod = `select sivcode "sivcode", to_char(sivdate,'dd-mm-yyyy') "sivdate",to_char(startdate,'dd-mm-yyyy') "startdate",to_char(enddate,'dd-mm-yyyy') "enddate", inputby "inputby", to_char(inputdate,'dd-mm-yyyy') "inputdate",storecode "storecode" 
from siv a, (select startdate, add_months(enddate,1) enddate from periodctlmst x, periodcontrol y
where upper(system)='STORES'
AND CURRENTACCYEAR= accyear   and CURRENTPERIODSEQ    = periodseq
) b 
where (
to_char (sivdate,'MM/YYYY') = to_char (b.startdate,'MM/YYYY') or
to_char (sivdate,'MM/YYYY') = to_char (b.enddate,'MM/YYYY'))  
and sivcode like upper('%'||:0||'%')
order by sivcode`

module.exports = SivPeriod