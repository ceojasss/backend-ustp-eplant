const ProvCode = `select prov_code "code", description "description" 
from ref_province
where iso_country_2 = :1 
and (prov_code) LIKE UPPER('%' || :0 || '%') OR (description) LIKE UPPER('%' || :0 || '%')`

module.exports = ProvCode