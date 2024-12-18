const SpkType = `select kode, des from (
    select '1' kode, 'MAJOR' des from dual
    union all
    select '0' kode, 'MINOR' des from dual
    )
    where des like  ('%'||:0||'%')`

module.exports = SpkType