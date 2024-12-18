const CityCode = `select city_code "code", city_name "description" from ref_city
where iso_country_2 = :1  and prov_code = :2
and  (city_name) LIKE UPPER('%' || :0 || '%')
`

module.exports = CityCode