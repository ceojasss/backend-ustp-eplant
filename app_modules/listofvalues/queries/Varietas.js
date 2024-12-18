const Varietas = `
select varietas "code", description "description" from(
    select 'Tenera' varietas, 'Tenera' description from dual
    union all
    select 'Pesifera' varietas, 'Pesifera' description from dual
    union all
    select 'Dura' varietas, 'Dura' description from dual)
    where varietas like ('%'||:0||'%')`


module.exports = Varietas;
