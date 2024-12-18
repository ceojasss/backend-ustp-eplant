const baseQuery = `  SELECT parametervaluecode "code", parametervalue "description",rate "add_description"
FROM epmsapps.parametervalue
WHERE parametercode = 'EP050' AND PARAMETERVALUECODE LIKE ('%' || :0 || '%')
ORDER BY seqno `

module.exports = baseQuery