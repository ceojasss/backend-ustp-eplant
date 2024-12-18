const Priority=`select kode "code", des "description" from (
    select 1 kode, 'Reguler' des from dual
    union all
    select 2 kode, 'Emergency' des from dual
    )
    where des like upper ('%'||:0||'%')`;
module.exports = Priority