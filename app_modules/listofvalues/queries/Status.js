const Status = `select kode "kode", des "des" from (
    select 'CLOSED' kode, 'CLOSED' des from dual
    union all
    select 'CANCELED' kode, 'CANCELED' des from dual
    )
    where des like  ('%'||:0||'%')`

module.exports = Status