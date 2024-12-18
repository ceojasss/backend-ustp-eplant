const CountryCode =  `select iso_country_2 "code", name_en "description" 
from ref_country 
where (iso_country_2) LIKE UPPER('%' || :0 || '%') OR (name_en) LIKE UPPER('%' || :0 || '%')
`

module.exports = CountryCode
