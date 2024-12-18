const CashFlow=`select parametervaluecode"code",parametervalue"parametervalue" 
from parametervalue where (parametervaluecode) LIKE UPPER('%' || :0 || '%') and
parametercode='EPMS104' order by parametervaluecode ASC`
module.exports=CashFlow
