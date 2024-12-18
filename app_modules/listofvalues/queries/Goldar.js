const lovyesno = `select kode, des from (
    select 'AB' kode, 'AB' des from dual
    union all
    select 'A' kode, 'A' des from dual
    union all
    select 'B' kode, 'B' des from dual
    union all
    select 'O' kode, 'O' des from dual
    )
    where des like  ('%'||:0||'%')`


module.exports = lovyesno