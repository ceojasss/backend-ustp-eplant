const PlantingDistance = ` SELECT   parametervaluecode "code",parametervalue "description", rate "rate"
FROM parametervalue
WHERE parametercode = 'FOP27'
     AND NVL (INACTIVEDATE,TO_DATE('31129999','DDMMYYYY')) > SYSDATE
     and (   (parametervaluecode) LIKE UPPER ('%' || :0 || '%')
      OR (parametervalue) LIKE UPPER ('%' || :0 || '%')
     OR (rate) LIKE UPPER ('%' || :0 || '%'))
ORDER BY seq_no`

module.exports = PlantingDistance