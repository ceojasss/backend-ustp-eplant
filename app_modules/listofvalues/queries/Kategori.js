const kategori = `select kode, des from (
    select 'BANDARA - SITE' kode, 'BANDARA - SITE' des from dual
    union all
    select 'SITE - SITE' kode, 'SITE - SITE' des from dual
    union all
    select 'BANDARA - EXTERNAL' kode, 'BANDARA - EXTERNAL' des from dual
    )
    where des like  ('%'||:0||'%')`


module.exports = kategori