const categorytransrange = ` select categorytransport "code", /*, jobcode, getjob_des(jobcode) jobdesc,*/  rangearea "description", /*loadtype,*/ uom "uom" 
from emptransportrate2
where vehiclegroupcode = :1
and loadtype = :2
and (categorytransport like upper ('%'||:0||'%') or rangearea like  ('%'||:0||'%') or uom like  ('%'||:0||'%'))  
order by categorytransport, jobcode, rangearea, loadtype`
 
module.exports = categorytransrange