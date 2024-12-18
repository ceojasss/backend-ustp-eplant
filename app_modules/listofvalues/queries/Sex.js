const sex = `select kode, des from (
    select 0 kode, 'Male' des from dual
    union all
    select 1 kode, 'Female' des from dual
    )
    where des like  ('%'||:0||'%')`


module.exports = sex