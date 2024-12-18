const ParamVal = `select  PARAMETERVALUECODE,PARAMETERVALUE
from EPMSAPPS.parametervalue
where parametercode = :0
ORDER BY SEQNO`

module.exports = ParamVal
