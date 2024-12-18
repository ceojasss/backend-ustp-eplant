const Workorder = ` select workorderno "code", to_char(orderdate,'dd-mm-yyyy') "description",keluhan "keluhan" from WORKORDERHEADER where process_flag = 'APPROVED' 
and workorderno not in (select workorderno from WOCOMPLETION) and (workorderno like upper ('%'||:0||'%') or reqestedbydept like upper ('%'||:0||'%'))  
order by workorderno

`

module.exports = Workorder
