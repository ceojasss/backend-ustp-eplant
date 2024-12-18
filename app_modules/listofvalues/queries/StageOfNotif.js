const stageofnotif = `select code "code", description "description" from (
    select '0' code, 'Verbal Warning' description from dual
    union all
    select '1' code, 'First Written Warning' description from dual
    union all
    select '2' code, 'Second Written Warning' description from dual
    union all
    select '3' code, 'Third Written Warning' description from dual
    union all
    select '4' code, 'Suspension' description from dual
    union all
    select '5' code, 'Dismissal' description from dual
    ) where  (description) LIKE ('%' || :0 || '%') or (code) LIKE ('%' || :0 || '%')
`

module.exports = stageofnotif