const ParamVal = `select  PARAMETERVALUECODE,PARAMETERVALUE
from parametervalue
where parametercode = :0
ORDER BY SEQ_NO`

module.exports = ParamVal