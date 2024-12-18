const lovyesno = `select kode, des from (
    select 'Y' kode, 'YES' des from dual
    union all
    select 'N' kode, 'NO' des from dual
    )
    where des like  ('%'||:0||'%')`


module.exports = lovyesno