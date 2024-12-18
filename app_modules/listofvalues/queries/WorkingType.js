const workingtype = `select parametervaluecode "code",
parametervalue "description" 
from parametervalue where 
(    (parametercode) LIKE UPPER ('%' || :0 || '%')
              OR  (parametervalue) LIKE UPPER ('%' || :0 || '%')) and
parametercode='CTR07' order by parametervaluecode ASC`

module.exports = workingtype