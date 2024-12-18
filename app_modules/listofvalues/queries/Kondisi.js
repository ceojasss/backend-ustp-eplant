const kondisi = `select kode, des from (
    select 'RUSAK' kode, 'RUSAK' des from dual
    union all
    select 'BAIK' kode, 'BAIK' des from dual
    )
    where des like  ('%'||:0||'%')`


module.exports = kondisi