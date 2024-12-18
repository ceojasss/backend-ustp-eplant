const JenisCuti =`select kode, des from (
        select 'CT' kode, 'CT' des from dual
        union all
        select 'CB' kode, 'CB' des from dual
        union all
        select 'CK' kode, 'CK' des from dual
        )
        where des like  ('%'||:0||'%')`
    
    module.exports = JenisCuti