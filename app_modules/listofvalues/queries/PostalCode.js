const PostalCode = `select postal_code "code", postal_name "description" from ref_postal p,
ref_city c 
where p.city_code = c.city_code 
and (postal_code) LIKE ('%' || :0 || '%') OR (postal_name) LIKE ('%' || :0 || '%')
`

module.exports = PostalCode