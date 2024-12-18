const lovyesno = `select kode, des from (
    select 1 kode, 'YES' des from dual
    union all
    select 0 kode, 'NO' des from dual
    )
    where des like  ('%'||:0||'%')`


module.exports = lovyesno