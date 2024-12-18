const classofnotice = `select code "code", description "description" from (
    select '0' code, 'Minor Of Notice' description from dual
    union all
    select '1' code, 'Major Of Notice' description from dual
    union all
    select '2' code, 'Graves Of Notice' description from dual
    union all
    select '3' code, 'Capital' description from dual
    ) where  (description) LIKE ('%' || :0 || '%') or (code) LIKE ('%' || :0 || '%')
`

module.exports = classofnotice