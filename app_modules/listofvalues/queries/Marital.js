const marital = `select kode, des from (
    select 0 kode, 'Single' des from dual
    union all
    select 1 kode, 'Married' des from dual
    union all
    select 2 kode, 'Widow/Er' des from dual
    )
    where des like  ('%'||:0||'%')`


module.exports = marital