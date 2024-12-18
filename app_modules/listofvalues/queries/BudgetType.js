const BudgetType=`select kode "code", des "description" from (
    select 'Y' kode, 'Tanaman' des from dual
    union all
    select 'N' kode, 'Non Tanaman' des from dual
    )
    where des like upper ('%'||:0||'%')`;
module.exports = BudgetType