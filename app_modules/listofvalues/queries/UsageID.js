const UsageId = 
`SELECT 
parametervaluecode "code", PARAMETERVALUE "description"
FROM parametervalue pv WHERE parametercode='FOP15' and (parametervalue LIKE ('%' || :0 || '%') OR parametervaluecode LIKE ('%' || :0 || '%'))`
module.exports  = UsageId;

