const assign_store = `select  kode "kode" ,assign_to "assign_store" from (
    select 'HO' kode,'HO' assign_to from dual
    union all
    select 'KEBUN' kode,'KEBUN' assign_to from dual 
    union all
    select 'PKS' kode,'PKS' assign_to from dual)
    where kode like  ('%'||:0||'%')`

module.exports = assign_store