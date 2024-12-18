const AssetType =`select kode, des from (
    select 'CIP' kode, 'CIP' des from dual
    union all
    select 'Expense Asset' kode, 'Expense Asset' des from dual
    union all
    select 'Fixed Asset' kode, 'Fixed Asset' des from dual
    )
    where des like  ('%'||:0||'%') `
module.exports=AssetType