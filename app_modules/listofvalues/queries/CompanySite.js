const Companysite =`select kode, des from (
    select 'HO' kode, 'HO' des from dual
    union all
    select 'SO' kode, 'SO' des from dual
    )
    where des like  ('%'||:0||'%')`

module.exports = Companysite