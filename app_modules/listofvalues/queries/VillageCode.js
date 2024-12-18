const VillageCode =  `SELECT  village_code "code", village_NAME "description"
FROM   ref_villages
WHERE village_code = :1 and (village_code) LIKE UPPER('%' || :0 || '%') OR (village_NAME) LIKE UPPER('%' || :0 || '%')
ORDER BY   village_code
`

module.exports = VillageCode
