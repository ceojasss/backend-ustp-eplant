const IntEksnal = `select fromcode "code", description "description" from (
    select '0' fromcode, 'Internal' description from dual
    union all
    select '1' fromcode, 'External' description from dual)
    where fromcode like  ('%'||:0||'%')`

module.exports = IntEksnal