const IFSubType = `SELECT ifsubtype "ifsubtype", ifsubtypename "ifsubtypename"
FROM infrastructuresubtype
WHERE iftype = :1 and ((ifsubtype) LIKE upper ('%' || :0 || '%') OR (ifsubtypename) LIKE upper ('%' || :0 || '%'))
ORDER BY iftype`

module.exports = IFSubType