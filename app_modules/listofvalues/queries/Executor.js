const executor = `select executorcode "executorcode", description "description" from (
    select '0' executorcode, 'Internal' description from dual
    union all
    select '1' executorcode, 'External' description from dual)
    where executorcode like  ('%'||:0||'%')`

module.exports = executor