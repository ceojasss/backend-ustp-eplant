const lovyesno = `select kode, des from (
    select 'KEBUN' kode, 'KEBUN' des from dual
    union all
    select 'PKS' kode, 'PKS' des from dual
    )
    where des like  ('%'||:0||'%')`


module.exports = lovyesno