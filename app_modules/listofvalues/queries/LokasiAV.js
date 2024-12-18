const lokasiav = `select kode, des from (
    select 'KBN' kode, 'KEBUN' des from dual
    union all
    select 'PKS' kode, 'PKS' des from dual
    )
    where des like  ('%'||:0||'%')`


module.exports = lokasiav