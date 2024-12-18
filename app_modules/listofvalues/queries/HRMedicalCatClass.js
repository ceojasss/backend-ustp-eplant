const hrmedcatclass = `SELECT parametervaluecode, parametervalue
FROM epmsapps.parametervalue
WHERE     parametercode = 'EP089'
     AND controlsystem = :1
     AND (   UPPER (parametervaluecode) LIKE '%' || UPPER ( :0) || '%'
          OR UPPER (parametervalue) LIKE '%' || UPPER ( :0) || '%')`

module.exports = hrmedcatclass