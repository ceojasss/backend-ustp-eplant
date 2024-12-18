const VoucherType =`select kode "code", des "description" from (
    select 1 kode, 'AP Supplier' des from dual
    union all
    select 2 kode, 'AP Contractor' des from dual
    union all
    select 3 kode, 'Cash Book' des from dual
    )
    where des like upper ('%'||:0||'%')`
module.exports= VoucherType
