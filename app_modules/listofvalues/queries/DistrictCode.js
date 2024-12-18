const DistrictCode =  `SELECT   DISTRICT_code "code", DISTRICT_NAME "description"
FROM   ref_DISTRICTS
WHERE CITY_CODE = :1 and (DISTRICT_code) LIKE UPPER('%' || :0 || '%') OR (DISTRICT_NAME) LIKE UPPER('%' || :0 || '%')
ORDER BY   DISTRICT_code
`

module.exports = DistrictCode
