const AssignMachine = `select  kode "kode" ,assign_to "assign_vehicle" from (
    select 'TEKNIK' kode,'TEKNIK' assign_to from dual
    union all
    select 'KEBUN' kode,'KEBUN' assign_to from dual 
    union all
    select 'PKS' kode,'PKS' assign_to from dual)
    where kode like  ('%'||:0||'%')`

module.exports = AssignMachine
