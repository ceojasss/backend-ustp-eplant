const levelcode = `select levelcode "levelcode", description "description" from (
    select 'GROUP' levelcode, 'GROUP' description from dual
    union all
    select 'INDIVIDUAL' levelcode, 'INDIVIDUAL' description from dual)
    where levelcode like  ('%'||:0||'%')`

module.exports = levelcode
