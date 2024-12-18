const CityCode = `select city_code "code", city_name "description" from ref_city
where iso_country_2 = 'ID'  and prov_code = :1
and  (city_name) LIKE UPPER('%' || :0 || '%')
`

module.exports = CityCode